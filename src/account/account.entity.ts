import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class account{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    balance: number;


}