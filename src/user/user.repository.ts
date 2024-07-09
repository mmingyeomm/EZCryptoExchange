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



}