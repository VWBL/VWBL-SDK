import { Amount } from '../common';
import { BaseTransaction, GlobalFlags, Account } from './common';
import type { TransactionMetadataBase } from './metadata';
export declare enum NFTokenCreateOfferFlags {
    tfSellNFToken = 1
}
export interface NFTokenCreateOfferFlagsInterface extends GlobalFlags {
    tfSellNFToken?: boolean;
}
export interface NFTokenCreateOffer extends BaseTransaction {
    TransactionType: 'NFTokenCreateOffer';
    NFTokenID: string;
    Amount: Amount;
    Owner?: Account;
    Expiration?: number;
    Destination?: Account;
    Flags?: number | NFTokenCreateOfferFlagsInterface;
}
export interface NFTokenCreateOfferMetadata extends TransactionMetadataBase {
    offer_id?: string;
}
export declare function validateNFTokenCreateOffer(tx: Record<string, unknown>): void;
//# sourceMappingURL=NFTokenCreateOffer.d.ts.map