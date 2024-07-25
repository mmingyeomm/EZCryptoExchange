import { Module } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { AssetRepository } from 'src/asset/asset.repository';
import { UserRepository } from 'src/user/user.repository';

@Module({



    providers: [ TransactionService, TransactionRepository, AssetRepository, UserRepository],
    controllers: [TransactionController]
})
export class TransactionModule {}
