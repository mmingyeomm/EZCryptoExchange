import { Injectable } from "@nestjs/common";
import { AssetRepository } from "src/asset/asset.repository";
import { ChargeRepository } from "src/charge/charge.repository";
import { UserRepository } from "src/user/user.repository";
import { UserService } from "src/user/user.service";
import { Contract, ethers } from "ethers";
import { tokenConfigs } from "./utils/transactions.tokens.config";
import { BuyAssetDto } from "./dto/transaction.dto";

@Injectable()
export class TransactionService{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly assetRepository: AssetRepository
    ){}

    async buyToken(userId: number, buyAssetDTO: BuyAssetDto) {
        console.log(buyAssetDTO)
        const usdtBalance = await this.assetRepository.getAmount("USDT", userId);
        const balanceInCents = Math.round(usdtBalance * 100);
        const amountInCents = Math.round(buyAssetDTO.amount * 100);
    
        if (balanceInCents >= amountInCents) {
          console.log('Available token configs:', Object.keys(tokenConfigs));
          console.log('Requested asset name:', buyAssetDTO.assetName);
          
          // Remove quotation marks from assetName
          const cleanAssetName = buyAssetDTO.assetName.replace(/"/g, '');
          console.log('Cleaned asset name:', cleanAssetName);
          
          const tokenConfig = tokenConfigs[cleanAssetName];
          
          if (tokenConfig) {
            const { abi, contractAddress } = tokenConfig;
            
            console.log(`Buying ${buyAssetDTO.amount} of ${cleanAssetName}`);
            console.log(`Using ABI:`, abi);
            console.log(`Contract address:`, contractAddress);
            
            // Implement your token buying logic here
            
          } else {
            console.error(`Configuration for ${cleanAssetName} not found in tokenConfigs`);
            throw new Error(`Configuration for ${cleanAssetName} not found`);
          }
        } else {
          throw new Error('Insufficient USDT balance');
        }
    }

}   
