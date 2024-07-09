import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("users")
export class UserController{
    constructor(private readonly userService:UserService){}

    @Get('request-kakao-pay')
    async requestKakaoPay() {
        return this.userService.requestToKakaoPay();
    }

    @Get(':userId/wallet/assets')
    async getUserWalletAssets(@Param('userId') userId: number) {

        return this.userService.getUserAssets(userId);
    }

    
    @Get('')



    @Get('approval')
    async approval() {
        return "approval";
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