import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Charge } from "./charge.entity";

@Injectable()
export class ChargeRepository extends Repository<Charge>{
    constructor(dataSource: DataSource) {
        super(Charge, dataSource.createEntityManager());
    }

    async getUserWithCharge(chargeId: number): Promise<Charge> {
        return this.createQueryBuilder("charge")
            .leftJoinAndSelect("charge.user", "user")
            .where("charge.id = :chargeId", { chargeId })
            .getOne();
    }


}