import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import axios from 'axios';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

async  create(data: Partial<Transaction>): Promise<Transaction> {
     const existing = await this.transactionRepository.findOne({
    where: { reference: data.reference },
  });

  if (existing) {
    throw new Error(`Ya existe una transacción con la referencia ${data.reference}`);
  }

  const transaction = this.transactionRepository.create({
    ...data,
    status: 'PENDING',
  });

  return this.transactionRepository.save(transaction);
}

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

async updateOrCreate(transactionData: {
  wompiId: string;
  reference: string;
  amountInCents: number;
  currency: string;
  status: string;
  customerEmail: string;
}) {
  let existing = await this.transactionRepository.findOne({ where: { reference: transactionData.reference } });

  if (existing) {
    existing.status = transactionData.status;
    existing.wompiId = transactionData.wompiId;
    existing.customerEmail = transactionData.customerEmail;
    return await this.transactionRepository.save(existing);
  }

  const tx = this.transactionRepository.create(transactionData);
  return await this.transactionRepository.save(tx);
}

async findByReference(reference: string) {
  return this.transactionRepository.findOne({ where: { reference } });
}

}


