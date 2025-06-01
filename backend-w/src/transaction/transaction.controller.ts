import { Controller, Get, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

   @Post()
  async create(@Body() body: Partial<Transaction>): Promise<{ status: string; transaction: Transaction }> {
    const transaction = await this.transactionService.create(body);
    const finalStatus = await this.transactionService.processPayment(transaction);
    return { status: finalStatus, transaction };
  }

  @Get()
  findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }
}
