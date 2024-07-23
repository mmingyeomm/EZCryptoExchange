import { Module } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

@Module({



    providers: [ TransactionService, TransactionRepository],
    controllers: [TransactionController]
})
export class TransactionModule {}
