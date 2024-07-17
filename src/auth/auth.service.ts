import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserDetails } from "./utils/types";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/user/user.entity";
import { Mnemonic, ethers } from 'ethers';
import axios from "axios";
import { UserService } from "src/user/user.service";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { AxiosResponse } from 'axios';
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService{

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
                private readonly userService: UserService,
                private httpService: HttpService, 
                private jwtService: JwtService,)
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
          console.log("sociallogin")
          // Exchange code for access token
          const tokenResponse = await lastValueFrom(this.httpService.post(
            'https://kauth.kakao.com/oauth/token',
            {
              code: code,
              client_id: process.env.KAKAO_CLIENT_ID,
              client_secret: process.env.KAKAO_SECRET,
              redirect_uri: `${process.env.KAKAO_CALLBACK_URL}`,
              grant_type: 'authorization_code',
            },
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
              },
            }
          ));
          console.log(tokenResponse)
          const accessToken = tokenResponse.data.access_token;
          console.log(accessToken)
          // 2. Use access token to get user info from Kakao
          const userInfoResponse = await lastValueFrom(this.httpService.get('https://kapi.kakao.com/v2/user/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          }));

          const kakaoUser = userInfoResponse.data;

          console.log("kakaouserEntity : " + kakaoUser)
          // 3. Find or create user in our database
          let user = await this.userRepository.findOneBy({email: kakaoUser.email});
          if (user) return user;
          const wallet = ethers.Wallet.createRandom()
          if (!user) {
            this.userRepository.save(user);({
              email: kakaoUser.kakao_account.email,
              name: kakaoUser.properties.nickname,
              walletPrivateKey : wallet.privateKey,
              walletAddress : wallet.address,
            });
          }

          // 4. Generate JWT
          const jwt = this.jwtService.sign({ 
            userId: user.id,
            email: user.email,
          });

          // 5. Return JWT and user info
          return {
            access_token: jwt,
            user: {
              id: user.id,
              email: user.email,
            },
          };

        } catch (error) {
          throw new HttpException('Failed to authenticate with Kakao', HttpStatus.UNAUTHORIZED);
        }

    }



}

