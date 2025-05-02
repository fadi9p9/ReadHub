import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // const configService = app.get(ConfigService);
  // console.log('Google Config:', {
  //   clientID: configService.get('GOOGLE_CLIENT_ID'),
  //   callbackURL: configService.get('GOOGLE_CALLBACK_URL')
  // });

  await app.listen(3000);
}
bootstrap();