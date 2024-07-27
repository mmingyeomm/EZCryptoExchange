import { Body, Controller, Param, ParseIntPipe, Post, ValidationPipe } from "@nestjs/common";
import { TransactionService } from "./transaction.service";




@Controller("transaction")
export class TransactionController{

    constructor(private readonly transactionService: TransactionService,

    ){}

    @Post(':userId/buy')
    async buyAsset(
        @Param('userId') userId: number,
        @Body('amount') amount: number,
        @Body('assetName') assetName: string, 
    ) {
        return await this.transactionService.buyToken(
        userId,
        amount,
        assetName
        );
    }
}
