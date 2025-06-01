import { Controller, Get, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() body: Partial<Transaction>): Promise<Transaction> {
    return this.transactionService.create(body);
  }

  @Get()
  findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }
}
