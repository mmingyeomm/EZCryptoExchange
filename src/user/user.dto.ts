export class AssetDto {
    id: number;
    assetName: string;
    averageBought: number;
    bought: number;
    amount: number;
    price: number;
    totalPrice: number;
    ROI: number;
    Return: number;
}


export class UserAssetsDto {
    userId: number;
    email: string;
    assets: AssetDto[];
}

export class TransactionDto {
    timestamp: string;
    name: string;
    market: string;
    type: string;
    quantity: number;
}


export class UserTransactionsDTO {
    userId: number;
    email: string;
    transactionss: TransactionDto[];
  }