import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { AuthService } from 'src/auth/auth.service';


@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {

  constructor(private readonly configService: ConfigService,
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({	
      clientID: configService.get('KAKAO_CLIENTID'),
      clientSecret: configService.get('KAKAO_SECRET'),
      callbackURL: configService.get('KAKAO_CALLBACK_URL'),
    });
  }

  

  async validate(accessToken: string, refreshToken: string, profile: Profile) {

    console.log(accessToken)
    console.log(refreshToken)
    console.log(profile)


    const user = await this.authService.validateUser({email: profile._json.kakao_account.email, 
                                   displayName:profile.displayName, walletPrivateKey: "1", walletAddress: "1" })

    console.log(user)
    return user || null; 
}
}