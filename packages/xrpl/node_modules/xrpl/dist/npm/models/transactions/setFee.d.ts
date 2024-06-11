import { BaseTransaction } from './common';
export interface SetFeePreAmendment extends BaseTransaction {
    BaseFee: string;
    ReferenceFeeUnits: number;
    ReserveBase: number;
    ReserveIncrement: number;
}
export interface SetFeePostAmendment extends BaseTransaction {
    BaseFeeDrops: string;
    ReserveBaseDrops: string;
    ReserveIncrementDrops: string;
}
export type SetFee = {
    TransactionType: 'SetFee';
} & (SetFeePreAmendment | SetFeePostAmendment);
//# sourceMappingURL=setFee.d.ts.map