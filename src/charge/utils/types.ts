export type ChargeDetails = {
    tid: string,
    email: string;
    amount: number;
    userId: number;
}

export type ChargeState = 'Success' | 'Fail';
