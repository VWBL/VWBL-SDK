import { FieldInstance } from '../enums';
import { type SerializedType } from '../types/serialized-type';
/**
 * Bytes list is a collection of Uint8Array objects
 */
declare class BytesList {
    private bytesArray;
    /**
     * Get the total number of bytes in the BytesList
     *
     * @return the number of bytes
     */
    getLength(): number;
    /**
     * Put bytes in the BytesList
     *
     * @param bytesArg A Uint8Array
     * @return this BytesList
     */
    put(bytesArg: Uint8Array): BytesList;
    /**
     * Write this BytesList to the back of another bytes list
     *
     *  @param list The BytesList to write to
     */
    toBytesSink(list: BytesList): void;
    toBytes(): Uint8Array;
    toHex(): string;
}
/**
 * BinarySerializer is used to write fields and values to Uint8Arrays
 */
declare class BinarySerializer {
    private sink;
    constructor(sink: BytesList);
    /**
     * Write a value to this BinarySerializer
     *
     * @param value a SerializedType value
     */
    write(value: SerializedType): void;
    /**
     * Write bytes to this BinarySerializer
     *
     * @param bytes the bytes to write
     */
    put(bytes: Uint8Array): void;
    /**
     * Write a value of a given type to this BinarySerializer
     *
     * @param type the type to write
     * @param value a value of that type
     */
    writeType(type: typeof SerializedType, value: SerializedType): void;
    /**
     * Write BytesList to this BinarySerializer
     *
     * @param bl BytesList to write to BinarySerializer
     */
    writeBytesList(bl: BytesList): void;
    /**
     * Calculate the header of Variable Length encoded bytes
     *
     * @param length the length of the bytes
     */
    private encodeVariableLength;
    /**
     * Write field and value to BinarySerializer
     *
     * @param field field to write to BinarySerializer
     * @param value value to write to BinarySerializer
     */
    writeFieldAndValue(field: FieldInstance, value: SerializedType, isUnlModifyWorkaround?: boolean): void;
    /**
     * Write a variable length encoded value to the BinarySerializer
     *
     * @param value length encoded value to write to BytesList
     */
    writeLengthEncoded(value: SerializedType, isUnlModifyWorkaround?: boolean): void;
}
export { BytesList, BinarySerializer };
