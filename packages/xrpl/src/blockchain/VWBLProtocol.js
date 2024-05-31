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
exports.VWBLXRPLProtocol = void 0;
const xrpl_1 = require("xrpl");
class VWBLXRPLProtocol {
    constructor(xrplChainId, walletAddress, xumm) {
        this.xumm = xumm;
        this.walletAddress = walletAddress;
        let publicServerUrl;
        switch (xrplChainId) {
            case 0:
                publicServerUrl = process.env.XRPL_MAINNET_PROVIDER_URL || "";
                break;
            case 1:
                publicServerUrl = process.env.XRPL_TESTNET_PROVIDER_URL || "";
                break;
            case 2:
                publicServerUrl = process.env.XRPL_DEVNET_PROVIDER_URL || "";
                break;
            default:
                throw new Error("Invalid xrplChainId");
        }
        const client = new xrpl_1.Client(publicServerUrl);
        this.client = client;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.disconnect();
        });
    }
    mintToken(transferRoyalty, isTransferable, isBurnable) {
        return __awaiter(this, void 0, void 0, function* () {
            const TagId = 11451419;
            const mintTxJson = {
                TransactionType: "NFTokenMint",
                Account: this.walletAddress,
                NFTokenTaxon: TagId,
                SourceTag: TagId,
                TransferFee: transferRoyalty,
                Flags: {
                    tfTransferable: isTransferable,
                    tfBurnable: isBurnable,
                },
            };
            let txId;
            let nftokenID;
            try {
                const response = yield this.xumm.payload.create({ txjson: mintTxJson });
                if (response) {
                    const payload = yield this.xumm.payload.get(response);
                    txId = payload === null || payload === void 0 ? void 0 : payload.response.txid;
                }
            }
            catch (e) {
                throw new Error(`NFTokenMint failed: ${e}`);
            }
            return nftokenID;
        });
    }
    payMintFee(nftokenId, destination, amount, gasFee) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountInfo = yield this.client.request({
                command: "account_info",
                account: this.walletAddress,
            });
            const sequence = accountInfo.result.account_data.Sequence;
            const ledger = yield this.client.request({
                command: "ledger",
                ledger_index: "validated",
            });
            const currentLedgerIndex = ledger.result.ledger_index;
            const paymentTxJson = {
                TransactionType: "Payment",
                Account: this.walletAddress,
                Destination: destination,
                Amount: (0, xrpl_1.xrpToDrops)(amount),
                Fee: (0, xrpl_1.xrpToDrops)(gasFee),
                LastLedgerSequence: currentLedgerIndex + 4,
                Sequence: sequence,
                Memos: [
                    {
                        Memo: {
                            MemoData: nftokenId,
                        },
                    },
                ],
            };
            // const signedPaymentTx = this.wallet.sign(paymentTxJson);
            // try {
            //   const response = await this.client.submitAndWait(signedPaymentTx.tx_blob);
            //   return response.result.hash;
            // } catch (e) {
            //   throw new Error(`Payment failed: ${e}`);
            // }
        });
    }
}
exports.VWBLXRPLProtocol = VWBLXRPLProtocol;
