// src/notifications/notifications.gateway.ts
import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayInit, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsConnectionService } from './notifications.connection.service';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway(500, {
  transports: ['websocket'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
    credentials: true
  },
  // transports: ['websocket'] 
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly connectionService: NotificationsConnectionService,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket Notifications Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      
      if (!token) {
        throw new Error('No token provided');
      }

      const { id: userId } = await this.authService.verifyToken(token);
      
      client.join(`user_${userId}`);
      this.connectionService.addConnection(userId);
      
      const pendingNotifications = await this.notificationService.getPendingNotifications(userId);
      for (const notification of pendingNotifications) {
        this.server.to(`user_${userId}`).emit('new_notification', notification);
        await this.notificationService.markAsDelivered(notification.id);
      }

      const unreadCount = await this.notificationService.getUnreadCount(userId);
      client.emit('unread_count', unreadCount);
    } catch (e) {
      console.error('Connection error:', e.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
  }

  sendNewNotification(userId: number, notification: Notification) {
    if (this.connectionService.isUserConnected(userId)) {
      this.server.to(`user_${userId}`).emit('new_notification', notification);
    } else {
      this.connectionService.addPendingNotification(userId, notification);
    }
  }
}