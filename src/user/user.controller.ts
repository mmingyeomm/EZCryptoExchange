import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController{
    constructor(private readonly userService:UserService){}

    @Get('request-kakao-pay')
    async requestKakaoPay() {
        return this.userService.requestToKakaoPay();
    }

    @Get('approval')
    async approval() {
        return "approval";
    }

    @Get('cancle')
    async cancle() {
        return "approval";
    }

    @Get('fail')
    async fail() {
        return "approval";
    }
}