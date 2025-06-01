import { Controller, Get, Query, InternalServerErrorException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService,
    private readonly httpService: HttpService,
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
    console.log("Response de Wompi:", response.data);
    const { status } = response;
    return { status };
  } catch (error) {
    console.error("Error al consultar transacción:", error.response?.data || error.message);
    throw new InternalServerErrorException("Error consultando transacción");
  }
}
}
//https://checkout.co.uat.wompi.dev/l