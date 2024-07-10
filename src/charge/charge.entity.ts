import { Asset } from "src/asset/asset.entity";
import { Transaction } from "src/transaction/transaction.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'charge'})
export class Charge {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    tid: string;

    @Column()
    partnerOrderId: string;

    @Column()
    amount: number;

    @Column()
    requestTime: Date; 


    @ManyToOne(() => User, user => user.assets)
    user: User;
}