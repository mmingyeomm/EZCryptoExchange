import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { DataSource } from 'typeorm';
import { PassportModule } from '@nestjs/passport';
import { TransactionModule } from './transaction/transaction.module';
import { Transaction } from './transaction/transaction.entity';
import { Asset } from './asset/asset.entity';
import { AssetModule } from './asset/asset.module';
import { ChargeModule } from './charge/charge.module';
import { Charge } from './charge/charge.entity';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), UserModule , AuthModule, 
    TypeOrmModule.forRoot({

    type: 'mysql',

    // host: 'ezcryptoexchange.creye0kuc4ct.ap-northeast-2.rds.amazonaws.com',
    host: 'localhost',

    username: 'root',
    port: 3306,

    // password: 'rootroot',
    password: 'root',

    database: 'ezcryptoexchange',
    entities: [User, Transaction, Asset, Charge],
    synchronize: true,

  }), 
  PassportModule.register({session:true}), TransactionModule, AssetModule, ChargeModule
],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor(private dataSource: DataSource) {}
  
}
