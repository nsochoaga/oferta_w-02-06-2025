import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,
    ) {}

async createTransaction(reference: string, amountInCents: number, currency: string, customerEmail: string) {
    
    let existing = await this.transactionRepo.findOne({ where: { reference: reference } });

  if (existing) {
    existing.status = 'PENDING'; 
    existing.customerEmail = customerEmail;
    existing.amountInCents = amountInCents;
    existing.currency = currency;
    return await this.transactionRepo.save(existing);
  }
    
    const transaction = this.transactionRepo.create({
      reference,
      amountInCents,
      currency,
      customerEmail,
      status: 'PENDING',
    });
    
    return this.transactionRepo.save(transaction);
  }

  private readonly integritySecret = 'stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp';

  generateIntegrityHash(reference: string, amountInCents: number, currency: string = 'COP', expirationTime?: string): string {
    let rawString = `${reference}${amountInCents}${currency}`;
    if (expirationTime) {
      rawString += expirationTime;
    }
    rawString += this.integritySecret;

    return crypto.createHash('sha256').update(rawString).digest('hex');
  }

async findAll() {
  return this.transactionRepo.find(); 
}

}
