import { Module } from '@nestjs/common';
import { ChargeRepository } from './charge.repository';
import { HttpModule } from '@nestjs/axios';
import { ChargeService } from './charge.service';
import { ChargeController } from './charge.controller';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';

@Module({
    imports: [HttpModule.registerAsync({
        useFactory: async () => ({
          timeout: 5000,
          maxRedirects: 5,
        }),
      }),],
    providers: [ChargeRepository, ChargeService, UserService, UserRepository],
    controllers: [ChargeController]
})
export class ChargeModule {}
