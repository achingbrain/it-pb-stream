import type { Duplex } from 'it-stream-types';
import type { Uint8ArrayList } from 'uint8arraylist';
export interface WrappedDuplex {
    read: (bytes?: number) => Promise<Uint8ArrayList>;
    readLP: () => Promise<Uint8ArrayList>;
    readPB: <T>(proto: {
        decode: (data: Uint8Array) => T;
    }) => Promise<T>;
    write: (input: Uint8Array | Uint8ArrayList) => void;
    writeLP: (input: Uint8Array | Uint8ArrayList) => void;
    writePB: (data: Uint8Array | Uint8ArrayList, proto: {
        encode: (data: any) => Uint8Array;
    }) => void;
    pb: <Return>(proto: {
        encode: (data: any) => Uint8Array;
        decode: (data: Uint8Array) => Return;
    }) => {
        read: () => Promise<Return>;
        write: (d: Uint8Array) => void;
    };
    unwrap: () => Duplex<Uint8Array>;
}
export interface LengthDecoderFunction {
    (data: Uint8Array | Uint8ArrayList): number;
    bytes: number;
}
export interface LengthEncoderFunction {
    (value: number, target: Uint8Array, offset: number): number | Uint8Array;
    bytes: number;
}
export interface Opts {
    poolSize: number;
    minPoolSize: number;
    lengthEncoder: LengthEncoderFunction;
    lengthDecoder: LengthDecoderFunction;
    maxLengthLength: number;
    maxDataLength: number;
}
export declare function itPbRpc(duplex: Duplex<Uint8Array>, opts?: {}): WrappedDuplex;
//# sourceMappingURL=index.d.ts.map