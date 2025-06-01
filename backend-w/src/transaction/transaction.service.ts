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
    return this.transactionRepository.save(transaction);
  }

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async processPayment(transaction: Transaction): Promise<'APPROVED' | 'REJECTED'> {
  try {
    const response = await axios.post(
      'https://api-sandbox.co.uat.wompi.dev/v1/transactions',
      {
        amount_in_cents: Number(transaction.amount) * 100,
        currency: 'COP',
        customer_email: transaction.customerEmail,
        payment_method: {
          type: 'CARD',
          token: 'tok_test_visa_4242', // token de tarjeta de prueba de Wompi
        },
        reference: transaction.id,
      },
      {
        headers: {
          Authorization: `Bearer prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg`,
        },
      },
    );

    const status = response.data.data.status; // usually 'APPROVED' or 'DECLINED'
    const finalStatus = status === 'APPROVED' ? 'APPROVED' : 'REJECTED';

    // actualizar en base de datos
    await this.transactionRepository.update(transaction.id, {
      status: finalStatus,
    });

    return finalStatus;
  } catch (error) {
    console.error('Error al procesar pago con Wompi:', error.response?.data || error.message);

    await this.transactionRepository.update(transaction.id, {
      status: 'REJECTED',
    });

    return 'REJECTED';
  }
}
}


