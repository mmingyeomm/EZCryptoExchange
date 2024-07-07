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
      clientID: "ea6e7a064dd68c986c9c28153f2e9d4d",

      clientSecret: "XT15CeDinRRx2M9Ju3h70S1AiDpghKjM",
      callbackURL: "http://52.78.206.45:3001/api/auth/kakao/redirect",
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