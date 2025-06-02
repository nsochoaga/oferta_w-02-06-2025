import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  wompiId: string;

  @Column({ unique: true })
  reference: string;

  @Column()
  amountInCents: number;

  @Column()
  currency: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  customerEmail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
