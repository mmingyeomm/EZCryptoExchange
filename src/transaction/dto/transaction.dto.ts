import { IsString, IsNumber, IsPositive } from 'class-validator';

export class BuyAssetDto {
  @IsString()
  assetName: string;

  amount: any;
}