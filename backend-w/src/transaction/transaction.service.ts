import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  create(data: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...data,
      status: 'PENDING',
    });
    return this.transactionRepository.save(transaction);
  }

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }
}
