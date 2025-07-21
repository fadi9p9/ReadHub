import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { WsAdapter } from '@nestjs/platform-ws';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));

app.useStaticAssets(join(process.cwd(), 'uploads'), {
  prefix: '/uploads/',
});

  app.enableCors({
    origin: ['http://127.0.0.1:5501', 'http://localhost:3000', 'http://127.0.0.1:5501', 'http://localhost:5501'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });

  await app.listen(5000);
  console.log('🚀 Server is running on http://localhost:5000');

}
bootstrap();
