import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

app.useStaticAssets(join(process.cwd(), 'uploads'), {
  prefix: '/uploads/',
});

  app.enableCors({
    origin: 'http://localhost:3000', 
    credentials: true,
  });

  await app.listen(5000);
}
bootstrap();
