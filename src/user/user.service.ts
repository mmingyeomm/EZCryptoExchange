import { HttpService } from "@nestjs/axios";
import { Injectable, NotFoundException } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Observable, lastValueFrom } from "rxjs";
import { AssetDto, TransactionDto, UserAssetsDto, UserTransactionsDTO, } from "./user.dto";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";

@Injectable()
export class UserService {
    constructor(private readonly httpService: HttpService,
                private readonly userRepository: UserRepository
    ) {}

    

    

    async getUserById(userId: number): Promise<User>{
        return this.userRepository.findOne( {where: { id: userId }});
    }
    
    async getUserAssets(userId: number): Promise<UserAssetsDto> {
        const user = await this.userRepository.getAssetsWithUser(userId);
    
        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
    
        const assetDtos: AssetDto[] = user.assets.map(asset => ({
          id: asset.id,
          assetName: asset.asset_name,
          averageBought: asset.average_bought,
          bought: asset.bought,
          amount: asset.amount,
          price: asset.price,
          totalPrice: asset.total_price,
          ROI: asset.ROI,
          Return: asset.Return,
        }));
    
        return {
          userId: user.id,
          email: user.email,
          assets: assetDtos,
        };
      }
    
    async getUserTransactions(userId: number): Promise<UserTransactionsDTO>{
  
        const user = await this.userRepository.getTransactionsWithUser(userId);

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
          }
        
        const transactionDtos: TransactionDto[] = user.transactions.map(transaction => ({
            id: transaction.id,
            timestamp: transaction.timestamp,
            name: transaction.name,
            market: transaction.market,
            type: transaction.type,
            quantity: transaction.quantity
          }));

          console.log(transactionDtos)
          console.log("userservice:getUserTransactions")
        return {
            userId: user.id,
            email: user.email,
            transactions: transactionDtos,
        }
    }
    
}