import { HttpService } from "@nestjs/axios";
import { Injectable, NotFoundException } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Observable, lastValueFrom } from "rxjs";
import { UserRepository } from "src/user/user.repository";

@Injectable()
export class AssetService {
    constructor(private readonly httpService: HttpService,
                private readonly userRepository: UserRepository
    ) {}

    
    

    

}