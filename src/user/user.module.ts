import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpModule } from '@nestjs/axios';
import { UserController } from './user.controller';

@Module({
    imports: [HttpModule.registerAsync({
        useFactory: async () => ({
          timeout: 5000,
          maxRedirects: 5,
        }),
      }),],
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule {}
