import InnerNode from './InnerNode';
import { NodeType } from './node';
declare class SHAMap {
    root: InnerNode;
    constructor();
    get hash(): string;
    addItem(tag: string, data: string, type: NodeType): void;
}
export * from './node';
export default SHAMap;
//# sourceMappingURL=index.d.ts.map