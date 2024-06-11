import { Amount } from '../common';
import { BaseTransaction } from './common';
import type { TransactionMetadataBase } from './metadata';
export interface NFTokenAcceptOffer extends BaseTransaction {
    TransactionType: 'NFTokenAcceptOffer';
    NFTokenSellOffer?: string;
    NFTokenBuyOffer?: string;
    NFTokenBrokerFee?: Amount;
}
export interface NFTokenAcceptOfferMetadata extends TransactionMetadataBase {
    nftoken_id?: string;
}
export declare function validateNFTokenAcceptOffer(tx: Record<string, unknown>): void;
//# sourceMappingURL=NFTokenAcceptOffer.d.ts.map