import { BaseTransaction, GlobalFlags } from './common';
export declare enum PaymentChannelClaimFlags {
    tfRenew = 65536,
    tfClose = 131072
}
export interface PaymentChannelClaimFlagsInterface extends GlobalFlags {
    tfRenew?: boolean;
    tfClose?: boolean;
}
export interface PaymentChannelClaim extends BaseTransaction {
    TransactionType: 'PaymentChannelClaim';
    Flags?: number | PaymentChannelClaimFlagsInterface;
    Channel: string;
    Balance?: string;
    Amount?: string;
    Signature?: string;
    PublicKey?: string;
}
export declare function validatePaymentChannelClaim(tx: Record<string, unknown>): void;
//# sourceMappingURL=paymentChannelClaim.d.ts.map