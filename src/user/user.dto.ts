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
    displayName: string;
    walletAddress: string;
    assets: AssetDto[];
}

