import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from '../../order/entities/order.entity';

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  address: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  deliveryDate: Date;

  @ManyToOne(() => Order, (order) => order.deliveries, { onDelete: 'CASCADE' })
  order: Order;
}
