import { Injectable } from "@nestjs/common";
import { UserDetails } from "./utils/types";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/user/user.entity";
import { Mnemonic, ethers } from 'ethers';
import axios from "axios";
import { UserService } from "src/user/user.service";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";



@Injectable()
export class AuthService{

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
                private readonly userService: UserService,
                private httpService: HttpService, )
    {}

    async validateUser(details: UserDetails) {

        const user = await this.userRepository.findOneBy({email: details.email});
        if (user) return user;

        console.log("user not found");

        const wallet = ethers.Wallet.createRandom()

        details.walletPrivateKey = wallet.privateKey;
        details.walletAddress = wallet.address;

        const newUser = this.userRepository.create(details);

        return this.userRepository.save(newUser);
    }

    async findUser(id : number){
        const user = await this.userRepository.findOneBy({id});
        return user;
    }

    findAll(): Promise<User[]>{
        return this.userRepository.find()
    }
    
    async socialLogin(code: string) {
        try {
          // Exchange code for access token
          const tokenResponse = await lastValueFrom(this.httpService.post(
            'https://kauth.kakao.com/oauth/token',
            {
              code,
              client_id: 'ea6e7a064dd68c986c9c28153f2e9d4d',
              client_secret: 'XT15CeDinRRx2M9Ju3h70S1AiDpghKjM',
              redirect_uri: 'https://a0b9-121-161-195-61.ngrok-free.app/auth/callback',
              grant_type: 'authorization_code',
            },
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
              },
            }
          ));
    
          const accessToken = tokenResponse.data.access_token;
    
          // Get user info from social provider
          const userInfoResponse = await lastValueFrom(this.httpService.get(
            'https://kapi.kakao.com/v2/user/me',
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
              },
            }
          ));
    
          const socialUserInfo = userInfoResponse.data;
          console.log(socialUserInfo);
    
          // Create or update user in your database
          const user = await this.validateUser({
            email: socialUserInfo.kakao_account.email,
            displayName: socialUserInfo.properties.nickname,
            walletPrivateKey: "1",
            walletAddress: "1"
          });
    
          // Generate JWT
          // const token = this.jwtService.sign({ userId: user.id });
    
          // return { token };
          return user;
        } catch (error) {
          console.error('Error in social login:', error);
          throw error;
        }
      }

}





