import { HttpService } from "@nestjs/axios";
import { Injectable, NotFoundException } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Observable, lastValueFrom } from "rxjs";
import { AssetDto, TransactionDto, UserAssetsDto, UserTransactionsDTO, } from "./user.dto";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
    constructor(private readonly httpService: HttpService,
                private readonly userRepository: UserRepository
    ) {}

    async requestToKakaoPay(): Promise<AxiosResponse<any>> {
        const url = 'https://open-api.kakaopay.com/online/v1/payment/ready';
        const headers = {
            
            'Authorization': 'SECRET_KEY DEVB707D3F985C29167F2EE70FE078541F72778F', // 실제 API 키로 대체
            'Content-Type': 'application/json',

        };
        const data = {
            cid: 'TC0ONETIME',  // 테스트 코드
            partner_order_id: 'partner_order_id',
            partner_user_id: 'partner_order_id',
            item_name: 'token',
            quantity: 10,
            total_amount: 10000,
            tax_free_amount: 0,
            approval_url: 'http://52.78.206.45:3001/user/approval',
            cancel_url: 'http://52.78.206.45:3001/user/cancel',
            fail_url: 'http://52.78.206.45:3001/user/fail',
        };
    
        try {
          console.log('Sending request to Kakao Pay:', url);
          console.log('Headers:', headers);
          console.log('Params:', data.toString());

          const response = await lastValueFrom(
              this.httpService.post(url, data, { headers })
          );
          console.log('Response received:', response.data);
          return response.data;
          } catch (error) {
              console.error('Kakao Pay request error:', error.response?.data || error.message);
              console.error('Full error object:', error);
              throw new Error(`Failed to request Kakao Pay: ${error.message}`);
          }
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