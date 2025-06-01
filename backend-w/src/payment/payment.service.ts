import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private readonly integritySecret = 'stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp';

  generateIntegrityHash(reference: string, amountInCents: number, currency: string = 'COP', expirationTime?: string): string {
    let rawString = `${reference}${amountInCents}${currency}`;
    if (expirationTime) {
      rawString += expirationTime;
    }
    rawString += this.integritySecret;

    return crypto.createHash('sha256').update(rawString).digest('hex');
  }
}
