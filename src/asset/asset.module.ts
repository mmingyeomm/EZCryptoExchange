import { Module } from '@nestjs/common';
import { AssetRepository } from './asset.repository';

@Module({


    providers: [AssetRepository]
})
export class AssetModule {}
