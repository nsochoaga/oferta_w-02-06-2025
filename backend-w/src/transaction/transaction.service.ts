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

  create(data: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...data,
      status: 'PENDING',
    });
    console.log("📩 función create de transactionservice", data);
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
    console.log("📩 Actualizando transacción existente:", existing.id);
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


