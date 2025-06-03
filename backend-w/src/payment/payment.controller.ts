import { Controller, Get, Query, InternalServerErrorException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Body, Post } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';


@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService,
    private readonly httpService: HttpService,
    private readonly transactionService: TransactionService
  ) {}

  @Get('integrity-hash')
  getIntegrityHash(
    @Query('reference') reference: string,
    @Query('amount') amount: string,
    @Query('expiration') expiration?: string
  ) {
    const amountInCents = parseInt(amount, 10);
    const hash = this.paymentService.generateIntegrityHash(reference, amountInCents, 'COP', expiration);
    return { hash };
  }

@Get("status")
async getTransactionStatus(@Query("id") id: string) {
    
  try {
    const response = await firstValueFrom(
      this.httpService.get(`https://api-sandbox.co.uat.wompi.dev/v1/transactions/${id}`)
    );
    const transactionData = response.data.data;
    const { status } = response.data.data; 
    const {email} = transactionData.merchant;
    const reference = transactionData.reference;
    console.log("📩 Datos de la transacción:", transactionData);
    if (status ) {
      await this.transactionService.updateOrCreate({
        wompiId: transactionData.id,
        reference: transactionData.reference,
        amountInCents: transactionData.amount_in_cents,
        currency: transactionData.currency,
        status: transactionData.status,
        customerEmail: transactionData.merchant.email,
      });
    }

    return { status, email, reference };
  } catch (error) {
    console.error("Error al consultar transacción:", error.response?.data || error.message);
    throw new InternalServerErrorException("Error consultando transacción");
  }
}

@Post('transaction')
async createTransaction(
  @Body('reference') reference: string,
  @Body('amount') amount: number,
  @Body('currency') currency: string,
  @Body('customerEmail') customerEmail: string
) {
  try {
    const existing = await this.transactionService.findByReference(reference);
    if (existing) {
      return {
        message: 'Transaction already exists',
        transactionId: existing.id,
      };
    }

    const tx = await this.paymentService.createTransaction(reference, amount, currency, customerEmail);
    return { transactionId: tx.id };
  } catch (err) {
    console.error(err);
    throw new InternalServerErrorException('Error creando la transacción');
  }
}

// payment.controller.ts
@Get("all")
async getAllTransactions() {
  return this.transactionService.findAll(); // Esto debe usar tu repositorio
}


}

