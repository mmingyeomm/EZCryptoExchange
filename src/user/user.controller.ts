import { Body, Controller, Get, Param, Post, Query, Req } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("users")
export class UserController{
    constructor(private readonly userService:UserService){}

    

    @Get(':userId/wallet/assets')
    async getUserWalletAssets(@Param('userId') userId: number) {

        return this.userService.getUserAssets(userId);
    }

    @Get(':userId/wallet/transactions')
    async getUserWalletTransactions(@Param('userId') userId: number) {

        return this.userService.getUserTransactions(userId);
    }

    @Get(':userId/wallet/transactions')
    async getUserWalletFail(@Param('userId') userId: number) {

        return this.userService.getUserTransactions(userId);
    }

}