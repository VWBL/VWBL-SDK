"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSACTION_TYPES = exports.TransactionType = exports.TransactionResult = exports.LedgerEntryType = exports.Type = exports.Field = exports.DEFAULT_DEFINITIONS = exports.XrplDefinitionsBase = exports.Bytes = void 0;
const definitions_json_1 = __importDefault(require("./definitions.json"));
const xrpl_definitions_base_1 = require("./xrpl-definitions-base");
Object.defineProperty(exports, "XrplDefinitionsBase", { enumerable: true, get: function () { return xrpl_definitions_base_1.XrplDefinitionsBase; } });
Object.defineProperty(exports, "Bytes", { enumerable: true, get: function () { return xrpl_definitions_base_1.Bytes; } });
/**
 * By default, coreTypes from the `types` folder is where known type definitions are initialized to avoid import cycles.
 */
const DEFAULT_DEFINITIONS = new xrpl_definitions_base_1.XrplDefinitionsBase(definitions_json_1.default, {});
exports.DEFAULT_DEFINITIONS = DEFAULT_DEFINITIONS;
const Type = DEFAULT_DEFINITIONS.type;
exports.Type = Type;
const LedgerEntryType = DEFAULT_DEFINITIONS.ledgerEntryType;
exports.LedgerEntryType = LedgerEntryType;
const TransactionType = DEFAULT_DEFINITIONS.transactionType;
exports.TransactionType = TransactionType;
const TransactionResult = DEFAULT_DEFINITIONS.transactionResult;
exports.TransactionResult = TransactionResult;
const Field = DEFAULT_DEFINITIONS.field;
exports.Field = Field;
/*
 * @brief: All valid transaction types
 */
const TRANSACTION_TYPES = DEFAULT_DEFINITIONS.transactionNames;
exports.TRANSACTION_TYPES = TRANSACTION_TYPES;
//# sourceMappingURL=index.js.map