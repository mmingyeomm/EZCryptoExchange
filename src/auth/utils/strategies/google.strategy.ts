import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-google-oauth20'
import * as dotenv from 'dotenv'
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {


    constructor(private readonly configService: ConfigService,
                @Inject('AUTH_SERVICE') private readonly authService: AuthService,) {
        super({
            clientID: configService.get('GOOGLE_CLIENTID'),
            clientSecret: configService.get('GOOGLE_SECRET'),
            callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
            scope: ['profile', 'email'],
        });    
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        console.log(profile)
        const user = await this.authService.validateUser({email: profile.emails[0].value, 
                                       displayName:profile.displayName, walletPrivateKey: "1", walletAddress: "1"})

        return user || null; 
    }
}