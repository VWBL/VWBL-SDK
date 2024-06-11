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
void sendReliableTx();
function sendReliableTx() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const { wallet: wallet1 } = yield client.fundWallet(null, {
            usageContext: 'code snippets',
        });
        const { wallet: wallet2 } = yield client.fundWallet(null, {
            usageContext: 'code snippets',
        });
        console.log('Balances of wallets before Payment tx');
        console.log(yield client.getXrpBalance(wallet1.classicAddress), yield client.getXrpBalance(wallet2.classicAddress));
        const payment = {
            TransactionType: 'Payment',
            Account: wallet1.classicAddress,
            Amount: '1000',
            Destination: wallet2.classicAddress,
        };
        const paymentResponse = yield client.submitAndWait(payment, {
            wallet: wallet1,
        });
        console.log('\nTransaction was submitted.\n');
        const txResponse = yield client.request({
            command: 'tx',
            transaction: paymentResponse.result.hash,
        });
        console.log('Validated:', txResponse.result.validated);
        console.log('Balances of wallets after Payment tx:');
        console.log(yield client.getXrpBalance(wallet1.classicAddress), yield client.getXrpBalance(wallet2.classicAddress));
        yield client.disconnect();
    });
}
//# sourceMappingURL=reliableTransactionSubmission.js.map