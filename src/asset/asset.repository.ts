import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Asset } from "./asset.entity";

@Injectable()
export class AssetRepository extends Repository<Asset>{
    constructor(dataSource: DataSource) {
        super(Asset, dataSource.createEntityManager());
    }

    
    async getAmount(assetName: string, userId: number): Promise<number | null> {
        const asset = await this.findOne({
            where: {
                asset_name: assetName,
                user: { id: userId }
            }
        });

        if (asset) {
            return asset.amount;
        }

        return null; // Return null if the asset is not found
    }
}