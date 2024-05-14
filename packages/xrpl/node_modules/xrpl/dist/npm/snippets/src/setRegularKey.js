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
function setRegularKey() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const { wallet: wallet1 } = yield client.fundWallet(null, {
            usageContext: 'code snippets',
        });
        const { wallet: wallet2 } = yield client.fundWallet(null, {
            usageContext: 'code snippets',
        });
        const { wallet: regularKeyWallet } = yield client.fundWallet(null, {
            usageContext: 'code snippets',
        });
        console.log('Balances before payment');
        console.log(yield client.getXrpBalance(wallet1.classicAddress));
        console.log(yield client.getXrpBalance(wallet2.classicAddress));
        const tx = {
            TransactionType: 'SetRegularKey',
            Account: wallet1.classicAddress,
            RegularKey: regularKeyWallet.classicAddress,
        };
        const response = yield client.submitAndWait(tx, {
            wallet: wallet1,
        });
        console.log('Response for successful SetRegularKey tx');
        console.log(response);
        const payment = {
            TransactionType: 'Payment',
            Account: wallet1.classicAddress,
            Destination: wallet2.classicAddress,
            Amount: '1000',
        };
        const submitTx = yield client.submit(payment, {
            wallet: regularKeyWallet,
        });
        console.log('Response for tx signed using Regular Key:');
        console.log(submitTx);
        console.log('Balances after payment:');
        console.log(yield client.getXrpBalance(wallet1.classicAddress));
        console.log(yield client.getXrpBalance(wallet2.classicAddress));
        yield client.disconnect();
    });
}
void setRegularKey();
//# sourceMappingURL=setRegularKey.js.map