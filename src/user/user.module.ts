import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpModule } from '@nestjs/axios';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
    imports: [HttpModule.registerAsync({
        useFactory: async () => ({
          timeout: 5000,
          maxRedirects: 5,
        }),
      }),],
    providers: [UserService, UserRepository,],
    controllers: [UserController]
})
export class UserModule {}
