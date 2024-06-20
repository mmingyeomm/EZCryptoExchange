import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-google-oauth20'
import * as dotenv from 'dotenv'
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {


    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get('GOOGLE_CLIENTID'),
            clientSecret: configService.get('GOOGLE_SECRET'),
            callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
            scope: ['profile', 'email'],
        });    
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
    }
}