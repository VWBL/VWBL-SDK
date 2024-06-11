type Input = Uint8Array | number[] | string;
export default class Sha512 {
    hash: import("@xrplf/isomorphic/dist/internal/types").Hash;
    static half(input: Input): Uint8Array;
    add(bytes: Input): this;
    addU32(i: number): this;
    finish(): Uint8Array;
    first256(): Uint8Array;
    first256BigInt(): bigint;
}
export {};
//# sourceMappingURL=Sha512.d.ts.map