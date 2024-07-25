import { Injectable } from "@nestjs/common";
import { AssetRepository } from "src/asset/asset.repository";
import { ChargeRepository } from "src/charge/charge.repository";
import { UserRepository } from "src/user/user.repository";
import { UserService } from "src/user/user.service";
import { Contract, ethers } from "ethers";

@Injectable()
export class TransactionService{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly assetRepository: AssetRepository
    ){}

    // async buyToken(userId: number, assetName: string, amount: number){
    //     if (await this.assetRepository.getAmount("USDT", userId) > amount) {
    //         let abi = [
    //             {
    //                 "inputs": [
    //                     {
    //                         "internalType": "address",
    //                         "name": "_token0",
    //                         "type": "address"
    //                     },
    //                     {
    //                         "internalType": "address",
    //                         "name": "_token1",
    //                         "type": "address"
    //                     }
    //                 ],
    //                 "stateMutability": "nonpayable",
    //                 "type": "constructor"
    //             },
    //             {
    //                 "inputs": [],
    //                 "name": "reserve0",
    //                 "outputs": [
    //                     {
    //                         "internalType": "uint256",
    //                         "name": "",
    //                         "type": "uint256"
    //                     }
    //                 ],
    //                 "stateMutability": "view",
    //                 "type": "function"
    //             },
    //             {
    //                 "inputs": [],
    //                 "name": "reserve1",
    //                 "outputs": [
    //                     {
    //                         "internalType": "uint256",
    //                         "name": "",
    //                         "type": "uint256"
    //                     }
    //                 ],
    //                 "stateMutability": "view",
    //                 "type": "function"
    //             },
    //             {
    //                 "inputs": [],
    //                 "name": "token0",
    //                 "outputs": [
    //                     {
    //                         "internalType": "contract IERC20",
    //                         "name": "",
    //                         "type": "address"
    //                     }
    //                 ],
    //                 "stateMutability": "view",
    //                 "type": "function"
    //             },
    //             {
    //                 "inputs": [],
    //                 "name": "token1",
    //                 "outputs": [
    //                     {
    //                         "internalType": "contract IERC20",
    //                         "name": "",
    //                         "type": "address"
    //                     }
    //                 ],
    //                 "stateMutability": "view",
    //                 "type": "function"
    //             }
    //         ]
         
    //           // provider api key 
    //           let provider = ethers.getDefaultProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_TOKEN}`);
    //           let contractAddress = "0xc4a29aEc039EbaB1e637Bd318A1916B12A4f6163"
    //           let walletPrivateKey = await this.userRepository.getWalletPrivateKeyWithUserId(userId);
        
        
    //           //private key 
    //           const signer = new ethers.Wallet(walletPrivateKey, provider);
        
    //           let contract = new Contract(contractAddress, abi, signer)
        
    //           let tx = await contract.approve(to, amount);
    //           let tx2 = await contract.transfer(to, amount);
        
    //           await tx.wait();
    //           await tx2.wait();
            

           
            
            

    //     }
    // }

}   
