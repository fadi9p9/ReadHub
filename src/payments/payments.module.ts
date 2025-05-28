import { Module } from '@nestjs/common';
import { PaymentController } from './payments.controller';

@Module({
  controllers: [PaymentController],
})
export class PaymentModule {}