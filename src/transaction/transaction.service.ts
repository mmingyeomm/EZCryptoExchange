import { Injectable } from "@nestjs/common";
import { AssetRepository } from "src/asset/asset.repository";
import { ChargeRepository } from "src/charge/charge.repository";
import { UserRepository } from "src/user/user.repository";
import { UserService } from "src/user/user.service";
import { ethers } from "ethers";

@Injectable()
export class TransactionService{
    constructor(
    ){}

    async buyToken(userId: number, assetName: string, amount: number){
        // if (this.assetRepository.getAmount("USDT", userId) > amount) {
        //     const privateKey = this.userRepository.getWalletPrivateKeyWithUserId(userId)
            

        // }
    }

}   
