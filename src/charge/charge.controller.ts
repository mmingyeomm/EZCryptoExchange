import { Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Query, Req } from "@nestjs/common";
import { ChargeService } from "./charge.service";
import { ChargeAmountDTO } from "./charge.dto";

@Controller("charge")
export class ChargeController{
    constructor(private readonly chargeService:ChargeService){}

    @Post(':userId/charge-amount')
    async chargeUser(@Body() chargeDTO: ChargeAmountDTO, @Param('userId') userId: number){

        return  this.chargeService.requestToKakaoPay(userId, chargeDTO.amount);

    }

    @Get(':userId/approval')
    async approvePayment(@Param('userId') userId: number, @Query('partner_order_id') partnerOrderId: string, @Query('pg_token') pgToken: string) {
    try {
      // 1. 결제 정보 조회
      const chargeInfo = await this.chargeService.getChargeByPartnerOrderId(partnerOrderId);

      console.log("chargeInfo" + chargeInfo.partnerOrderId + chargeInfo.amount + pgToken + userId )
      console.log("------------------------------------------------------------------------")

      if (!chargeInfo) {
        throw new NotFoundException(`No charge found for partner_order_id: ${partnerOrderId}`);
      }

      // 2. 카카오페이 결제 승인 요청
      const approvalResult = await this.chargeService.approvePayment(userId, chargeInfo.tid, partnerOrderId, pgToken);

      // 3. 결제 정보 업데이트

      // 4. 사용자 잔액 업데이트

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

    @Get('fail')
    async fail() {
        return "fail";
    }


}