import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { AssetModule } from './asset/asset.module';
import { ChargeModule } from './charge/charge.module';
import { User } from './user/user.entity';
import { Transaction } from './transaction/transaction.entity';
import { Asset } from './asset/asset.entity';
import { Charge } from './charge/charge.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: 3306,
        username: 'root',
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: 'ezcryptoexchange',
        entities: [User, Transaction, Asset, Charge],
        synchronize: true,
      }),
    }),
    PassportModule.register({ session: true }),
    UserModule,
    AuthModule,
    TransactionModule,
    AssetModule,
    ChargeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}