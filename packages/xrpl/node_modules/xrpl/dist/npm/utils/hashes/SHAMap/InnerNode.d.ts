import { NodeType, Node } from './node';
declare class InnerNode extends Node {
    leaves: {
        [slot: number]: Node | undefined;
    };
    type: NodeType;
    depth: number;
    empty: boolean;
    constructor(depth?: number);
    get hash(): string;
    addItem(tag: string, node: Node): void;
    setNode(slot: number, node: Node): void;
    getNode(slot: number): Node | undefined;
}
export default InnerNode;
//# sourceMappingURL=InnerNode.d.ts.map