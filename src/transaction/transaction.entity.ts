import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Status} from './utils/transactions.enums';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column()
  name: string;

  @Column()
  market: string;

  @Column()
  type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  @Column()
  status: Status;

  @ManyToOne(() => User, user => user.transactions)
  user: User;
}