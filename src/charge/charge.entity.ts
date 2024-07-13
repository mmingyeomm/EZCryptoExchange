import { Asset } from "src/asset/asset.entity";
import { Transaction } from "src/transaction/transaction.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChargeState } from "./utils/types";

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

    @Column({
        type: 'enum',
        enum: ['Success', 'Fail'],
        default: 'Fail'
    })
    state: ChargeState;

    @ManyToOne(() => User, user => user.assets)
    user: User;
}