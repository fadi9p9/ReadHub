import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportService } from './support.service';
import { SupportGateway } from './support.gateway';
import { SupportController } from './support.controller';
import { User } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { SupportMessage } from './entities/support-message.entity/support-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportMessage, User]),
    AuthModule,
  ],
  providers: [SupportService, SupportGateway],
  controllers: [SupportController],
})
export class SupportModule {}