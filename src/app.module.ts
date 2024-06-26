import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { DataSource } from 'typeorm';
import { PassportModule } from '@nestjs/passport';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), UserModule , AuthModule, TypeOrmModule.forRoot({

    type: 'mysql',
    host: 'localhost',
    username: 'root',
    port: 3306,
    password: 'root',
    database: 'ezcryptoexchange',
    entities: [User],
    synchronize: true,

  }), 
  PassportModule.register({session:true}), WalletModule, TransactionModule, OrderModule, 
],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor(private dataSource: DataSource) {}
  
}
