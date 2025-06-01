import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  productId: number;

  @Column()
  customerEmail: string;

  @Column({ type: 'varchar' })
  status: TransactionStatus;

  @CreateDateColumn()
  createdAt: Date;
}
