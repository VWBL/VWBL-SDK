import type { Client } from '../client';
import { Wallet } from '.';
export interface FundingOptions {
    amount?: string;
    faucetHost?: string;
    faucetPath?: string;
    usageContext?: string;
}
export interface FaucetRequestBody {
    destination?: string;
    xrpAmount?: string;
    usageContext?: string;
    userAgent: string;
}
export declare function generateWalletToFund(wallet?: Wallet | null): Wallet;
export declare function getStartingBalance(client: Client, classicAddress: string): Promise<number>;
export interface FundWalletOptions {
    faucetHost?: string;
    faucetPath?: string;
    amount?: string;
    usageContext?: string;
}
export declare function requestFunding(options: FundingOptions, client: Client, startingBalance: number, walletToFund: Wallet, postBody: FaucetRequestBody): Promise<{
    wallet: Wallet;
    balance: number;
}>;
//# sourceMappingURL=fundWallet.d.ts.map