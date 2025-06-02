import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HttpModule } from '@nestjs/axios';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  imports: [HttpModule, TransactionModule],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
