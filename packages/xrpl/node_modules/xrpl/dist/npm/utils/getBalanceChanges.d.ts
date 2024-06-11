import { Balance, TransactionMetadata } from '../models';
export default function getBalanceChanges(metadata: TransactionMetadata): Array<{
    account: string;
    balances: Balance[];
}>;
//# sourceMappingURL=getBalanceChanges.d.ts.map