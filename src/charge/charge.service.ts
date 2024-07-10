import { HttpService } from "@nestjs/axios";
import { ChargeRepository } from "./charge.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ChargeURLDTO } from "./charge.dto";
import { lastValueFrom } from "rxjs";
import { Charge } from "./charge.entity";
import { UserService } from "src/user/user.service";




@Injectable()
export class ChargeService {
    constructor(private readonly httpService: HttpService,
                private readonly chargeRepository: ChargeRepository,
                private readonly userService: UserService
            ) {}

    async requestToKakaoPay(userId: number, total_amount: number): Promise<ChargeURLDTO> {
        console.log(total_amount)

        const url = 'https://open-api.kakaopay.com/online/v1/payment/ready';
        const headers = {
            
            'Authorization': 'SECRET_KEY DEVB707D3F985C29167F2EE70FE078541F72778F', // 실제 API 키로 대체
            'Content-Type': 'application/json',

        };

        const partner_order_id = `order_${userId}_${Date.now()}`;

        const data = {
            cid: 'TC0ONETIME',  // 테스트 코드
            partner_order_id: partner_order_id,
            partner_user_id: userId.toString(),
            item_name: '요금 충전',
            total_amount: total_amount,
            quantity: 10,
            tax_free_amount: 0,
            approval_url: `http://localhost:3001/charge/${userId.toString()}/approval?partner_order_id=${partner_order_id}`,
            cancel_url: `http://localhost:3001/charge/${userId.toString()}/cancel?partner_order_id=${partner_order_id}`,
            fail_url: `http://localhost:3001/charge/${userId.toString()}/fail?partner_order_id=${partner_order_id}`,
        };
    
        try {
          console.log('Params:', data.toString());

          const response = await lastValueFrom(
              this.httpService.post(url, data, { headers })
          );
          console.log('Response received:', response.data);
          const nextRedirectPcUrl: string = response.data.next_redirect_pc_url;
          const tid: string = response.data.tid;
        
          this.createCharge(tid, partner_order_id,total_amount, userId)
          return {
            next_redirect_pc_url: nextRedirectPcUrl,
            tid : tid,
          };

          
          } catch (error) {
              console.error('Kakao Pay request error:', error.response?.data || error.message);
              console.error('Full error object:', error);
              throw new Error(`Failed to request Kakao Pay: ${error.message}`);
          }
    }

    async approvePayment(userId: number,tid: string, partnerOrderId: string, pgToken: string) {

        const url = 'https://open-api.kakaopay.com/online/v1/payment/approve';
        const headers = {
          'Authorization': 'SECRET_KEY DEVB707D3F985C29167F2EE70FE078541F72778F',
          'Content-Type': 'application/json',
        };
        const data = {
          cid: 'TC0ONETIME',
          tid: tid,
          partner_order_id: partnerOrderId,
          partner_user_id: userId, // 이 값은 원래 요청에서 사용한 값과 일치해야 합니다
          pg_token: pgToken
        };
    
        const response = await lastValueFrom(
          this.httpService.post(url, data, { headers })
        );
        console.log("approve end")
        return response.data;

      }
    

    async getChargeByPartnerOrderId(partnerOrderId: string): Promise<Charge> {
    return this.chargeRepository.findOne({ where: { partnerOrderId } });
    }



    async createCharge(tid: string, partnerOrderId: string, amount: number, userId: number): Promise<Charge> {
        console.log("createCharge")
        const user = await this.userService.getUserById(userId);
        
        if (!user) {
          throw new NotFoundException(`User with id ${userId} not found`);
        }
    
        const newCharge = this.chargeRepository.create({
          tid,
          partnerOrderId,
          amount,
          requestTime: new Date(),
          user
        });
    
        return this.chargeRepository.save(newCharge);
    }
}