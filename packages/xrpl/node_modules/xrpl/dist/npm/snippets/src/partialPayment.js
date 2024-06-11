"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const client = new src_1.Client('wss://s.altnet.rippletest.net:51233');
function partialPayment() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const { wallet: wallet1 } = yield client.fundWallet(null, {
            usageContext: 'code snippets',
        });
        const { wallet: wallet2 } = yield client.fundWallet(null, {
            usageContext: 'code snippets',
        });
        const trust_set_tx = {
            TransactionType: 'TrustSet',
            Account: wallet2.classicAddress,
            LimitAmount: {
                currency: 'FOO',
                issuer: wallet1.classicAddress,
                value: '10000000000',
            },
        };
        yield client.submitAndWait(trust_set_tx, {
            wallet: wallet2,
        });
        console.log('Balances after trustline is created');
        console.log(yield client.getBalances(wallet1.classicAddress));
        console.log(yield client.getBalances(wallet2.classicAddress));
        const issue_quantity = '3840';
        const payment = {
            TransactionType: 'Payment',
            Account: wallet1.classicAddress,
            Amount: {
                currency: 'FOO',
                value: issue_quantity,
                issuer: wallet1.classicAddress,
            },
            Destination: wallet2.classicAddress,
        };
        const initialPayment = yield client.submitAndWait(payment, {
            wallet: wallet1,
        });
        console.log(initialPayment);
        console.log('Balances after issuer(wallet1) sends IOU("FOO") to wallet2');
        console.log(yield client.getBalances(wallet1.classicAddress));
        console.log(yield client.getBalances(wallet2.classicAddress));
        const partialPaymentTx = {
            TransactionType: 'Payment',
            Account: wallet2.classicAddress,
            Amount: {
                currency: 'FOO',
                value: '4000',
                issuer: wallet1.classicAddress,
            },
            Destination: wallet1.classicAddress,
            Flags: src_1.PaymentFlags.tfPartialPayment,
        };
        const submitResponse = yield client.submitAndWait(partialPaymentTx, {
            wallet: wallet2,
        });
        console.log(submitResponse);
        console.log("Balances after Partial Payment, when wallet2 tried to send 4000 FOO's");
        console.log(yield client.getBalances(wallet1.classicAddress));
        console.log(yield client.getBalances(wallet2.classicAddress));
        yield client.disconnect();
    });
}
void partialPayment();
//# sourceMappingURL=partialPayment.js.map