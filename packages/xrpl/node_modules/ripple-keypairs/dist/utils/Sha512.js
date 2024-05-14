"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sha512_1 = require("@xrplf/isomorphic/sha512");
const utils_1 = require("@noble/curves/abstract/utils");
class Sha512 {
    constructor() {
        // instantiate empty sha512 hash
        this.hash = sha512_1.sha512.create();
    }
    static half(input) {
        return new Sha512().add(input).first256();
    }
    add(bytes) {
        this.hash.update(bytes);
        return this;
    }
    addU32(i) {
        const buffer = new Uint8Array(4);
        new DataView(buffer.buffer).setUint32(0, i);
        return this.add(buffer);
    }
    finish() {
        return this.hash.digest();
    }
    first256() {
        return this.finish().slice(0, 32);
    }
    first256BigInt() {
        return (0, utils_1.bytesToNumberBE)(this.first256());
    }
}
exports.default = Sha512;
//# sourceMappingURL=Sha512.js.map