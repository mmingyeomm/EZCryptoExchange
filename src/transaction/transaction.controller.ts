import { Body, Controller, Param, Post } from "@nestjs/common";
import { TransactionService } from "./transaction.service";




@Controller("transaction")
export class TransactionController{

    constructor(private readonly transactionService: TransactionService,

    ){}


    @Post(":userId/buy")
    async buyAsset(@Param('userId') userId: number,
                   @Body('assetName') assetName : string, 
                   @Body('amount') amount: number){
                  
        // this.transactionSer vice.buyToken( userId ,assetName, amount)


    }

}