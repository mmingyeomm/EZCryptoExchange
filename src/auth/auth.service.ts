import { Injectable } from "@nestjs/common";
import { UserDetails } from "./utils/types";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/user/user.entity";
import { Mnemonic, ethers } from 'ethers';



@Injectable()
export class AuthService{

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,)
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
    


}


