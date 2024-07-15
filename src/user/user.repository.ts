import { DataSource, Repository, Transaction } from "typeorm";
import { User } from "./user.entity";
import { Injectable } from "@nestjs/common";


@Injectable()
export class UserRepository extends Repository<User>{
    constructor(dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }


    async getAssetsWithUser(userId: number): Promise<User> {
        return this.createQueryBuilder('user')
          .leftJoinAndSelect('user.assets', 'asset')
          .where('user.id = :userId', { userId })
          .getOne();
      }


    async getTransactionsWithUser(userId: number): Promise<User> {
        return this.createQueryBuilder('user')
        .leftJoinAndSelect('user.transactions', 'asset')
        .where('user.id = :userId', { userId })
        .getOne();
    }

    async getwalletPrivateKeyWithUser(userId: number): Promise<string> {
        const result = await this.createQueryBuilder('user')
            .select('user.walletPrivateKey')
            .where('user.id = :userId', { userId })
            .getOne();

        if (!result || !result.walletPrivateKey) {
            throw new Error('Wallet private key not found for user');
        }

        return result.walletPrivateKey;
    } 


    async getwalletAddressWithUser(userId: number): Promise<string> {
        const result = await this.createQueryBuilder('user')
            .select('user.walletAddress')
            .where('user.id = :userId', { userId })
            .getOne();

        if (!result || !result.walletAddress) {
            throw new Error('Wallet address not found for user');
        }

        return result.walletAddress;
    } 
}