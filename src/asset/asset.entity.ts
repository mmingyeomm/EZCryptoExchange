import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';


@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  asset_name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  average_bought: number;

  @Column('decimal', { precision: 10, scale: 2 })
  bought: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total_price: number;

  @Column('decimal', { precision: 5, scale: 2 })
  ROI: number;

  @Column('decimal', { precision: 10, scale: 2 })
  Return: number;

  @ManyToOne(() => User, user => user.assets)
  user: User;
}