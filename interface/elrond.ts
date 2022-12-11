export enum ElrondType {
    MANAGED_ADDRESS = 1,
    TOKEN_IDENTIFIER = 2,
    STRING = 3,
    U_64 = 4,
    BIG_UINT = 5,
    BOOLEAN = 6,
};

export const DecodeType = {
    BECH32: 1,
    BASE64: 2,
    HEX: 3,
};

const decode_typing_mapping = {
    ManagedAddress: DecodeType.BECH32,
    TokenIdentifier: DecodeType.BASE64,
    string: DecodeType.BASE64,
    u64: DecodeType.HEX,
    BigUint: DecodeType.HEX,
};
type ElrondStructKey<T> = `${number}_${string & keyof T}`;
export type ElrondStruct<T> = {[key in ElrondStructKey<T>]: ElrondType};