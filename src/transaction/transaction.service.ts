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

    async buyToken(userId: number, amount: number, assetName: string) {

        const usdtBalance = await this.assetRepository.getAmount("USDT", userId);
        const balanceInCents = Math.round(usdtBalance * 100);
        const amountInCents = Math.round(amount * 100);
    
        const tokenConfig = tokenConfigs["USDT"];
        const { abi: usdtABI, contractAddress: usdtContractAddress } = tokenConfig;

        if (balanceInCents >= amountInCents) {
       
          const cleanAssetName = assetName.replace(/"/g, '');
          const tokenConfig = tokenConfigs[cleanAssetName];
          
          if (tokenConfig) {
            const { ammABI: tokenAMMABI   , ammAddress: tokenAmmAddress} = tokenConfig;
            
            let provider = ethers.getDefaultProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_TOKEN}`);
            let walletPrivateKey = await this.userRepository.getWalletPrivateKeyWithUserId(userId);
            const signer = new ethers.Wallet(walletPrivateKey, provider);

            let contract = new Contract(usdtContractAddress, usdtABI, signer)
            let tx = await contract.approve(tokenAmmAddress, amount);
            let balancebf = await contract.balanceOf("0xD7E283D171Aa9fdd4025E21628F4c99E188954fd")
            console.log("balance before" + balancebf)

            let contract2 = new Contract(tokenAmmAddress, tokenAMMABI, signer)
            let tx2 = await contract2.swap(usdtContractAddress, amount);

            console.log(`Buying ${amount} of ${cleanAssetName}`);
            console.log(tx.hash);
            console.log(tx2.hash);


          } else {
            console.error(`Configuration for ${cleanAssetName} not found in tokenConfigs`);
            throw new Error(`Configuration for ${cleanAssetName} not found`);
          }
        } else {
          throw new Error('Insufficient USDT balance');
        }
    }

}   
