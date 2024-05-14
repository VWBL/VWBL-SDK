import { BaseTransaction } from './common';
export interface PaymentChannelFund extends BaseTransaction {
    TransactionType: 'PaymentChannelFund';
    Channel: string;
    Amount: string;
    Expiration?: number;
}
export declare function validatePaymentChannelFund(tx: Record<string, unknown>): void;
//# sourceMappingURL=paymentChannelFund.d.ts.map