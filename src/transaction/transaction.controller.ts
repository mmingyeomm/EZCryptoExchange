import { Body, Controller, Param, ParseIntPipe, Post, ValidationPipe } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { BuyAssetDto } from "./dto/transaction.dto";




@Controller("transaction")
export class TransactionController{

    constructor(private readonly transactionService: TransactionService,

    ){}

    @Post(':userId/buy')
    async buyAsset(
        @Param('userId') userId: number,
        @Body() buyAssetDto: BuyAssetDto
    ) {
        console.log(buyAssetDto)
        return await this.transactionService.buyToken(
        userId,
        buyAssetDto
        );
    }
}
