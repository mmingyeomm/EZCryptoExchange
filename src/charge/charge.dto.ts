import { IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class ChargeAmountDTO{
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    amount : number;
}

export class ChargeURLDTO{
    next_redirect_pc_url: string;
    tid: string;
}

