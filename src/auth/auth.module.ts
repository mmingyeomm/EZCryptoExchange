import { Module } from '@nestjs/common';
import { authController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { SessionSerializer } from './utils/Serializer';
// import { GoogleStrategy } from './utils/strategies/google.strategy';
import { KakaoStrategy } from './utils/strategies/kakao.strategy';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
    imports: [
      TypeOrmModule.forFeature([User]),
      HttpModule.registerAsync({
        useFactory: () => ({
          timeout: 5000,
          maxRedirects: 5,
        }),
      }),
    ],
    controllers: [authController],
    providers: [
      AuthService,
      UserService,
      UserRepository,
      KakaoStrategy,
      SessionSerializer,
      {
        provide: 'AUTH_SERVICE',
        useClass: AuthService,
      }
    ],
    exports: [AuthService],
  })
  export class AuthModule {}