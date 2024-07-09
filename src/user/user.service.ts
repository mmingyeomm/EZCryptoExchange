import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Observable, lastValueFrom } from "rxjs";

@Injectable()
export class UserService {
    constructor(private readonly httpService: HttpService) {}

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

    
      
}