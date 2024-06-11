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
function multisigning() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const wallet1 = src_1.Wallet.generate();
        const wallet2 = src_1.Wallet.generate();
        const { wallet: walletMaster } = yield client.fundWallet(null, {
            usageContext: 'code snippets',
        });
        const signerListSet = {
            TransactionType: 'SignerListSet',
            Account: walletMaster.classicAddress,
            SignerEntries: [
                {
                    SignerEntry: {
                        Account: wallet1.classicAddress,
                        SignerWeight: 1,
                    },
                },
                {
                    SignerEntry: {
                        Account: wallet2.classicAddress,
                        SignerWeight: 1,
                    },
                },
            ],
            SignerQuorum: 2,
        };
        const signerListResponse = yield client.submit(signerListSet, {
            wallet: walletMaster,
        });
        console.log('SignerListSet constructed successfully:');
        console.log(signerListResponse);
        const accountSet = {
            TransactionType: 'AccountSet',
            Account: walletMaster.classicAddress,
            Domain: (0, src_1.convertStringToHex)('example.com'),
        };
        const accountSetTx = yield client.autofill(accountSet, 2);
        console.log('AccountSet transaction is ready to be multisigned:');
        console.log(accountSetTx);
        const { tx_blob: tx_blob1 } = wallet1.sign(accountSetTx, true);
        const { tx_blob: tx_blob2 } = wallet2.sign(accountSetTx, true);
        const multisignedTx = (0, src_1.multisign)([tx_blob1, tx_blob2]);
        const submitResponse = yield client.submit(multisignedTx);
        if (submitResponse.result.engine_result === 'tesSUCCESS') {
            console.log('The multisigned transaction was accepted by the ledger:');
            console.log(submitResponse);
            if (submitResponse.result.tx_json.Signers) {
                console.log(`The transaction had ${submitResponse.result.tx_json.Signers.length} signatures`);
            }
        }
        else {
            console.log("The multisigned transaction was rejected by rippled. Here's the response from rippled:");
            console.log(submitResponse);
        }
        yield client.disconnect();
    });
}
void multisigning();
//# sourceMappingURL=multisigning.js.map