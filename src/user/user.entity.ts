import { Asset } from "src/asset/asset.entity";
import { Transaction } from "src/transaction/transaction.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    displayName: string;

    @Column()
    walletPrivateKey: string; 

    @Column()
    walletAddress: string; 

    @OneToMany(() => Transaction, transaction => transaction.user)
    transactions: Transaction[];
  
    @OneToMany(() => Asset, asset => asset.user)
    assets: Asset[];
}