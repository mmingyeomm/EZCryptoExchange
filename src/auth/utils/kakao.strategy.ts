import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';


@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {

  async validate(	// POST /oauth/token 요청에 대한 응답이 담깁니다.
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      const { _json } = profile;
      const user = {
        kakaoId: _json.id,
      };
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}