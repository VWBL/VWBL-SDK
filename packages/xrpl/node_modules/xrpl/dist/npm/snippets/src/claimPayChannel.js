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
void claimPayChannel();
function claimPayChannel() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const { wallet: wallet1 } = yield client.fundWallet();
        const { wallet: wallet2 } = yield client.fundWallet();
        console.log('Balances of wallets before Payment Channel is claimed:');
        console.log(yield client.getXrpBalance(wallet1.classicAddress));
        console.log(yield client.getXrpBalance(wallet2.classicAddress));
        const paymentChannelCreate = {
            TransactionType: 'PaymentChannelCreate',
            Account: wallet1.classicAddress,
            Amount: '100',
            Destination: wallet2.classicAddress,
            SettleDelay: 86400,
            PublicKey: wallet1.publicKey,
        };
        const paymentChannelResponse = yield client.submitAndWait(paymentChannelCreate, { wallet: wallet1 });
        console.log(paymentChannelResponse);
        const accountObjectsRequest = {
            command: 'account_objects',
            account: wallet1.classicAddress,
        };
        const accountObjects = (yield client.request(accountObjectsRequest)).result
            .account_objects;
        console.log(accountObjects);
        const paymentChannelClaim = {
            Account: wallet2.classicAddress,
            TransactionType: 'PaymentChannelClaim',
            Channel: src_1.hashes.hashPaymentChannel(wallet1.classicAddress, wallet2.classicAddress, (_a = paymentChannelResponse.result.Sequence) !== null && _a !== void 0 ? _a : 0),
            Amount: '100',
        };
        const channelClaimResponse = yield client.submit(paymentChannelClaim, {
            wallet: wallet1,
        });
        console.log(channelClaimResponse);
        console.log('Balances of wallets after Payment Channel is claimed:');
        console.log(yield client.getXrpBalance(wallet1.classicAddress));
        console.log(yield client.getXrpBalance(wallet2.classicAddress));
        yield client.disconnect();
    });
}
//# sourceMappingURL=claimPayChannel.js.map