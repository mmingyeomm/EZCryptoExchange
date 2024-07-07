import { Module } from '@nestjs/common';
import { authController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { SessionSerializer } from './utils/Serializer';
// import { GoogleStrategy } from './utils/strategies/google.strategy';
import { KakaoStrategy } from './utils/strategies/kakao.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    controllers: [authController],
    providers: [
        // GoogleStrategy, 
        KakaoStrategy,
        SessionSerializer,
        {
            provide: 'AUTH_SERVICE',
            useClass: AuthService,
        } 
      ],

})
export class AuthModule {}
