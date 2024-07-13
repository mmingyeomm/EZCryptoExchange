import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Asset } from "./asset.entity";

@Injectable()
export class AssetRepository extends Repository<Asset>{
    constructor(dataSource: DataSource) {
        super(Asset, dataSource.createEntityManager());
    }

    
    

}