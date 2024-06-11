export declare enum NodeType {
    INNER = 1,
    TRANSACTION_NO_METADATA = 2,
    TRANSACTION_METADATA = 3,
    ACCOUNT_STATE = 4
}
export declare abstract class Node {
    abstract get hash(): string;
    abstract addItem(_tag: string, _node: Node): void;
}
//# sourceMappingURL=node.d.ts.map