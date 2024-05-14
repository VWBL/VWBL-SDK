import { BaseTransaction } from './common';
import type { TransactionMetadataBase } from './metadata';
export interface NFTokenCancelOffer extends BaseTransaction {
    TransactionType: 'NFTokenCancelOffer';
    NFTokenOffers: string[];
}
export interface NFTokenCancelOfferMetadata extends TransactionMetadataBase {
    nftoken_ids?: string[];
}
export declare function validateNFTokenCancelOffer(tx: Record<string, unknown>): void;
//# sourceMappingURL=NFTokenCancelOffer.d.ts.map