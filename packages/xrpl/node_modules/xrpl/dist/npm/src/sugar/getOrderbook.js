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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortAndLimitOffers = exports.separateBuySellOrders = exports.combineOrders = exports.extractOffers = exports.reverseRequest = exports.requestAllOffers = exports.createBookOffersRequest = exports.validateOrderbookOptions = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const errors_1 = require("../errors");
const Offer_1 = require("../models/ledger/Offer");
const DEFAULT_LIMIT = 20;
function sortOffers(offers) {
    return offers.sort((offerA, offerB) => {
        var _a, _b;
        const qualityA = (_a = offerA.quality) !== null && _a !== void 0 ? _a : 0;
        const qualityB = (_b = offerB.quality) !== null && _b !== void 0 ? _b : 0;
        return new bignumber_js_1.default(qualityA).comparedTo(qualityB);
    });
}
const getOrderbookOptionsSet = new Set([
    'limit',
    'ledger_index',
    'ledger_hash',
    'taker',
]);
function validateOrderbookOptions(options) {
    for (const key of Object.keys(options)) {
        if (!getOrderbookOptionsSet.has(key)) {
            throw new errors_1.ValidationError(`Unexpected option: ${key}`, options);
        }
    }
    if (options.limit && typeof options.limit !== 'number') {
        throw new errors_1.ValidationError('limit must be a number', options.limit);
    }
    if (options.ledger_index &&
        !(typeof options.ledger_index === 'number' ||
            (typeof options.ledger_index === 'string' &&
                ['validated', 'closed', 'current'].includes(options.ledger_index)))) {
        throw new errors_1.ValidationError('ledger_index must be a number or a string of "validated", "closed", or "current"', options.ledger_index);
    }
    if (options.ledger_hash !== undefined &&
        options.ledger_hash !== null &&
        typeof options.ledger_hash !== 'string') {
        throw new errors_1.ValidationError('ledger_hash must be a string', options.ledger_hash);
    }
    if (options.taker !== undefined && typeof options.taker !== 'string') {
        throw new errors_1.ValidationError('taker must be a string', options.taker);
    }
}
exports.validateOrderbookOptions = validateOrderbookOptions;
function createBookOffersRequest(currency1, currency2, options) {
    var _a, _b;
    const request = {
        command: 'book_offers',
        taker_pays: currency1,
        taker_gets: currency2,
        ledger_index: (_a = options.ledger_index) !== null && _a !== void 0 ? _a : 'validated',
        ledger_hash: options.ledger_hash === null ? undefined : options.ledger_hash,
        limit: (_b = options.limit) !== null && _b !== void 0 ? _b : DEFAULT_LIMIT,
        taker: options.taker ? options.taker : undefined,
    };
    return request;
}
exports.createBookOffersRequest = createBookOffersRequest;
function requestAllOffers(client, request) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = yield client.requestAll(request);
        return results.map((result) => result.result.offers);
    });
}
exports.requestAllOffers = requestAllOffers;
function reverseRequest(request) {
    return Object.assign(Object.assign({}, request), { taker_pays: request.taker_gets, taker_gets: request.taker_pays });
}
exports.reverseRequest = reverseRequest;
function extractOffers(offerResults) {
    return offerResults.flatMap((offerResult) => offerResult);
}
exports.extractOffers = extractOffers;
function combineOrders(directOffers, reverseOffers) {
    return [...directOffers, ...reverseOffers];
}
exports.combineOrders = combineOrders;
function separateBuySellOrders(orders) {
    const buy = [];
    const sell = [];
    orders.forEach((order) => {
        if ((order.Flags & Offer_1.OfferFlags.lsfSell) === 0) {
            buy.push(order);
        }
        else {
            sell.push(order);
        }
    });
    return { buy, sell };
}
exports.separateBuySellOrders = separateBuySellOrders;
function sortAndLimitOffers(offers, limit) {
    const sortedOffers = sortOffers(offers);
    return sortedOffers.slice(0, limit);
}
exports.sortAndLimitOffers = sortAndLimitOffers;
//# sourceMappingURL=getOrderbook.js.map