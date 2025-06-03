import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDeliveryDto {
  @IsNumber()
  orderId: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  status: string; // por ejemplo: "PENDING", "SHIPPED", "DELIVERED"
}
