import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SupportService } from './support.service';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  namespace: '/support',
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:5501'],
    credentials: true,
  },
})
export class SupportGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly supportService: SupportService,
    private readonly authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
  try {
    const token = client.handshake.auth.token;
    const user = await this.authService.verifyToken(token);

    // حفظ بيانات المستخدم في الاتصال
    client.data.user = user;

    if (user.role === 'admin') {
      client.join('admins');
      // إعلام الأدمن بالاتصال الجديد
      this.server.to('admins').emit('admin_connected', user);
    } else {
      client.join(`user_${user.id}`);
      // تحميل الرسائل السابقة وإرسالها للمستخدم
      const messages = await this.supportService.getMessages(user.id);
      client.emit('initial_messages', messages);
    }
  } catch (err) {
    console.error('Connection error:', err);
    client.emit('error', 'فشل المصادقة');
    client.disconnect();
  }
}

 @SubscribeMessage('support_message')
async handleUserMessage(
  @MessageBody() payload: any,
  @ConnectedSocket() client: Socket
) {
  try {
    // تحقق صارم من البيانات
    if (!payload || typeof payload !== 'object') {
      throw new Error('تنسيق البيانات غير صحيح');
    }

    // استخراج بيانات المستخدم من الاتصال
    const userId = client.data.user?.id;
    if (!userId) {
      throw new Error('لم يتم التعرف على المستخدم');
    }

    const message = String(payload.message).trim();
    if (!message) {
      throw new Error('الرسالة لا يمكن أن تكون فارغة');
    }

    const savedMessage = await this.supportService.saveMessage(userId, message, 'user');

    // إرسال البيانات كاملة للمشرفين
    this.server.to('admins').emit('new_message', {
      id: savedMessage.id,
      message: savedMessage.message,
      from: savedMessage.from,
      createdAt: savedMessage.createdAt,
      user: {
        id: savedMessage.user.id,
        first_name: savedMessage.user.first_name,
        last_name: savedMessage.user.last_name,
        email: savedMessage.user.email
      }
    });

    // إرسال تأكيد للمستخدم
    client.emit('message_sent', {
      id: savedMessage.id,
      message: savedMessage.message,
      createdAt: savedMessage.createdAt
    });

  } catch (error) {
    console.error('Error handling message:', error);
    client.emit('error', error.message);
  }
}

  @SubscribeMessage('support_reply')
  async handleAdminReply(
    @MessageBody() payload: { userId: number; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const savedReply = await this.supportService.saveMessage(
        payload.userId,
        payload.message,
        'admin',
      );

      this.server.to(`user_${payload.userId}`).emit('new_reply', savedReply);
    } catch (error) {
      client.emit('error', error.message);
    }
  }
}