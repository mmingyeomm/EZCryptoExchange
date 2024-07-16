import { Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Query, Req } from "@nestjs/common";
import { ChargeService } from "./charge.service";
import { ChargeAmountDTO } from "./charge.dto";
import { ethers } from "ethers";
import { UserRepository } from "src/user/user.repository";
import { ChargeRepository } from "./charge.repository";

@Controller("charge")
export class ChargeController{
    constructor(private readonly chargeService:ChargeService,
                private readonly chargeRepository:ChargeRepository,
                private readonly userRepository: UserRepository
    ){}

    @Post(':userId/charge-amount')
    async chargeUser(@Body() chargeDTO: ChargeAmountDTO, @Param('userId') userId: number){

        return  this.chargeService.requestToKakaoPay(userId, chargeDTO.amount);

    }

    @Get(':userId/approval')
    async approvePayment(@Param('userId') userId: number, @Query('partner_order_id') partnerOrderId: string, @Query('pg_token') pgToken: string) {
    try {
      // 1. 충전 정보 entity 조회 
      const charge = await this.chargeService.getChargeByPartnerOrderId(partnerOrderId);
      const user = await this.chargeRepository.getUserWithCharge(charge.id);

      if (!charge) {
        throw new NotFoundException(`No charge found for partner_order_id: ${partnerOrderId}`);
      }

      // 2. 카카오페이 결제 승인 요청
      const approvalResult = await this.chargeService.approvePayment(userId, charge.tid, partnerOrderId, pgToken);
      // 3. 결제 정보 업데이트 //enum 만들고 default를 승인 안됨으로 
      const changeState = await this.chargeService.changeState(charge);
      // 4. 사용자 잔액 업데이트
      // const updateAsset = await this.chargeService.changeAsset(charge);
      // 5. 지갑에 토큰 넣어주어야 됨. 


      const giveToken = await this.chargeService.giveToken(
          charge.amount, 
          await this.userRepository.getwalletAddressWithUser(user.user.id),
        );




      // 5. 성공 페이지로 리다이렉트 또는 성공 메시지 반환
      return { message: 'Payment approved successfully' };

    } catch (error) {
      console.error('Payment approval error:', error);
      // 실패 페이지로 리다이렉트 또는 에러 메시지 반환
      throw new HttpException('Payment approval failed', HttpStatus.BAD_REQUEST);
    }
  }

    @Get('cancle')
    async cancle() {
        return "cancle";
    }

    @Get('test')
    async test() {
      //  const result = this.chargeService.giveToken()
        // return result;
    }

    @Get('fail')
    async fail() {
        return "fail";
    }


}