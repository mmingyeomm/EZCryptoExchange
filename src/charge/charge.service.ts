import { HttpService } from "@nestjs/axios";
import { ChargeRepository } from "./charge.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ChargeURLDTO } from "./charge.dto";
import { lastValueFrom } from "rxjs";
import { Charge } from "./charge.entity";
import { UserService } from "src/user/user.service";
import { Contract, ethers, Wallet } from "ethers";

@Injectable()
export class ChargeService {
    constructor(private readonly httpService: HttpService,
                private readonly chargeRepository: ChargeRepository,
                private readonly userService: UserService,
            ) {}  
    // 처음 pay request가 왔을 때, 카카오페이에게 url 요청 
    async requestToKakaoPay(userId: number, total_amount: number): Promise<ChargeURLDTO> {

        const url = 'https://open-api.kakaopay.com/online/v1/payment/ready';
        const headers = {
            
            'Authorization': 'SECRET_KEY DEVB707D3F985C29167F2EE70FE078541F72778F', // 실제 API 키로 대체
            'Content-Type': 'application/json',

        };

        const partner_order_id = `order_${userId}_${Date.now()}`;

        const data = {
            cid: 'TC0ONETIME',  // 테스트 코드
            partner_order_id: partner_order_id,
            partner_user_id: userId.toString(),
            item_name: '요금 충전',
            total_amount: total_amount,
            quantity: 10,
            tax_free_amount: 0,
            approval_url: `http://localhost:3001/charge/${userId.toString()}/approval?partner_order_id=${partner_order_id}`,
            cancel_url: `http://localhost:3001/charge/${userId.toString()}/cancel?partner_order_id=${partner_order_id}`,
            fail_url: `http://localhost:3001/charge/${userId.toString()}/fail?partner_order_id=${partner_order_id}`,
        };
    
        try {

          const response = await lastValueFrom(
              this.httpService.post(url, data, { headers })
          );
          const nextRedirectPcUrl: string = response.data.next_redirect_pc_url;
          const tid: string = response.data.tid;
        
          this.createCharge(tid, partner_order_id,total_amount, userId)
          return {
            next_redirect_pc_url: nextRedirectPcUrl,
            tid : tid,
          };

          
          } catch (error) {
              console.error('Kakao Pay request error:', error.response?.data || error.message);
              console.error('Full error object:', error);
              throw new Error(`Failed to request Kakao Pay: ${error.message}`);
          }
    }

    // kakaopay에 approve 보냄 
    async approvePayment(userId: number, tid: string, partnerOrderId: string, pgToken: string) {
      const url = 'https://open-api.kakaopay.com/online/v1/payment/approve';
      const headers = {
        'Authorization': 'SECRET_KEY DEVB707D3F985C29167F2EE70FE078541F72778F',
        'Content-Type': 'application/json',
      };
      const data = {
        cid: 'TC0ONETIME',
        tid: tid,
        partner_order_id: partnerOrderId,
        partner_user_id: userId.toString(), // Convert to string to ensure compatibility
        pg_token: pgToken
      };
  
      try {
        console.log('Sending approval request with data:', JSON.stringify(data));
        const response = await lastValueFrom(
          this.httpService.post(url, data, { headers })
        );
        console.log('Approval response:', response.data);
        return response.data;
      } catch (error) {
        console.error('approvePayment Error:', error.response?.data || error.message);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        }
        throw new Error(`Failed to approve Payment: ${error.message}`);
      }
    }
    
    // state success로 바꾸기 
    async changeState(charge : Charge): Promise<boolean> {
        try {
          if (charge.state === 'Fail') {
            const chargeEntity = await this.chargeRepository.findOne({ where: { id: charge.id } });
            
            if (!chargeEntity) {
              throw new Error(`Charge with id ${charge.id} not found`);
            }
    
            chargeEntity.state = 'Success';
            await this.chargeRepository.save(chargeEntity);
            
            console.log(`Charge state changed to Success for id: ${charge.id}`);
            return true;
          } 

        }  catch (error) {
            console.error('changeState Error:', error.response?.data || error.message);
            console.error('Full error object:', error);
            throw new Error(`Failed to change State: ${error.message}`);
          }
    }

    // asset 바꾸기 
    // async changeAsset(charge : Charge): Promise<boolean>{
    //   try {
    //     if (charge.state === 'Success') {
    //       const assetEntity = await this.chargeRepository.findOne()
    //     }


    //   }
    // }

    async giveToken(amount : number, to: string, walletPrivateKey: string): Promise<boolean> {
      // approve token
      let abi = [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "initialOwner",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "ECDSAInvalidSignature",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "length",
              "type": "uint256"
            }
          ],
          "name": "ECDSAInvalidSignatureLength",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
            }
          ],
          "name": "ECDSAInvalidSignatureS",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "allowance",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "needed",
              "type": "uint256"
            }
          ],
          "name": "ERC20InsufficientAllowance",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "balance",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "needed",
              "type": "uint256"
            }
          ],
          "name": "ERC20InsufficientBalance",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "approver",
              "type": "address"
            }
          ],
          "name": "ERC20InvalidApprover",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "receiver",
              "type": "address"
            }
          ],
          "name": "ERC20InvalidReceiver",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            }
          ],
          "name": "ERC20InvalidSender",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            }
          ],
          "name": "ERC20InvalidSpender",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            }
          ],
          "name": "ERC2612ExpiredSignature",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "signer",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "ERC2612InvalidSigner",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "currentNonce",
              "type": "uint256"
            }
          ],
          "name": "InvalidAccountNonce",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidShortString",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "OwnableInvalidOwner",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "OwnableUnauthorizedAccount",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "str",
              "type": "string"
            }
          ],
          "name": "StringTooLong",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [],
          "name": "EIP712DomainChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "DOMAIN_SEPARATOR",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            }
          ],
          "name": "allowance",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "decimals",
          "outputs": [
            {
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "eip712Domain",
          "outputs": [
            {
              "internalType": "bytes1",
              "name": "fields",
              "type": "bytes1"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "version",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "chainId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "verifyingContract",
              "type": "address"
            },
            {
              "internalType": "bytes32",
              "name": "salt",
              "type": "bytes32"
            },
            {
              "internalType": "uint256[]",
              "name": "extensions",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "mint",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "nonces",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
            }
          ],
          "name": "permit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "renounceOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalSupply",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "transfer",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]

      // provider api key 
      let provider = ethers.getDefaultProvider("https://sepolia.infura.io/v3/035c5c117cd649d7bdbb5ee61b3cb696");

      let contractAddress = "0xfe2a1177ac7ea10e7fba0661a1282323d8df109f"

      //private key 
      const signer = new ethers.Wallet(walletPrivateKey, provider);

      let contract = new Contract(contractAddress, abi, signer)


      let tx = await contract.approve(to, amount/1350);
      let tx2 = await contract.transfer(to, amount/1350);



      await tx.wait();
      await tx2.wait();
      let balance = await contract.balanceOf(to)

      console.log(tx.hash);
      console.log(tx2.hash);
      console.log(balance);
      // transfer token 


      return true;

      }     

    


    // approve Payment위해서 pid가 필요한 상황이 생겨서 db에 넣어놓고 partner order id 를 통해 pid 찾음. 
    async getChargeByPartnerOrderId(partnerOrderId: string): Promise<Charge> {
      return this.chargeRepository.findOne({ where: { partnerOrderId } });
    }

    // pid를 특정하기 위해 charge를 db에 넣음 
    async createCharge(tid: string, partnerOrderId: string, amount: number, userId: number): Promise<Charge> {
        console.log("createCharge")
        const user = await this.userService.getUserById(userId);
        
        if (!user) {
          throw new NotFoundException(`User with id ${userId} not found`);
        }
    
        const newCharge = this.chargeRepository.create({
          tid,
          partnerOrderId,
          amount,
          requestTime: new Date(),
          user
        });
    
        return this.chargeRepository.save(newCharge);
    }

    
}