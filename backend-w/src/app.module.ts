import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { TransactionModule } from './transaction/transaction.module';
import { PaymentModule } from './payment/payment.module';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { DeliveryModule } from './delivery/delivery.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db-w-offer.ct04uoky6y1z.us-east-2.rds.amazonaws.com',
      port: 5432,
      username: 'postgres_w',
      password: 'mysecretpass',
      database: 'postgres',
      ssl: {
    rejectUnauthorized: false, 
  },
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
      autoLoadEntities: true,
      synchronize: true, 
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration available globally
     // envFilePath: '.env', // Load environment variables from .env file
    }),
    ProductModule,
    TransactionModule,
    PaymentModule,
    OrderModule,
    DeliveryModule,
  ],

})
export class AppModule {}
