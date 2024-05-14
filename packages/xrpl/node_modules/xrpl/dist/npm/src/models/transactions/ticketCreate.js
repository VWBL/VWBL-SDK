"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTicketCreate = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
const MAX_TICKETS = 250;
function validateTicketCreate(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    const { TicketCount } = tx;
    if (TicketCount === undefined) {
        throw new errors_1.ValidationError('TicketCreate: missing field TicketCount');
    }
    if (typeof TicketCount !== 'number') {
        throw new errors_1.ValidationError('TicketCreate: TicketCount must be a number');
    }
    if (!Number.isInteger(TicketCount) ||
        TicketCount < 1 ||
        TicketCount > MAX_TICKETS) {
        throw new errors_1.ValidationError('TicketCreate: TicketCount must be an integer from 1 to 250');
    }
}
exports.validateTicketCreate = validateTicketCreate;
//# sourceMappingURL=ticketCreate.js.map