import { Module } from '@nestjs/common';
import { authController } from './auth.controller';
import { GoogleStrategy } from './utils/google.strategy';

@Module({
    controllers: [authController],
    providers: [GoogleStrategy],

})
export class AuthModule {}
