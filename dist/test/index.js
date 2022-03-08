import { expect } from 'aegir/utils/chai.js';
import { pair } from 'it-pair';
import { itPbRpc } from '../src/index.js';
import { int32BEDecode, int32BEEncode } from 'it-length-prefixed';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';
import { Uint8ArrayList } from 'uint8arraylist';
import { Buffer } from 'buffer';
/* eslint-env mocha */
/* eslint-disable require-await */
const assertBytesEqual = (a, b) => {
    a = a instanceof Uint8Array ? a : a.slice();
    b = b instanceof Uint8Array ? b : b.slice();
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            throw new Error(`Byte at index ${i} incorrect, expected ${a[i]}, got ${b[i]}`);
        }
    }
};
const tests = {
    Buffer: {
        from: (str) => Buffer.from(str),
        alloc: (length, fill = 0) => Buffer.alloc(length, fill),
        allocUnsafe: (length) => Buffer.allocUnsafe(length),
        concat: (arrs, length) => Buffer.concat(arrs, length),
        writeInt32BE: (buf, value, offset) => buf.writeInt32BE(value, offset)
    },
    Uint8Array: {
        from: (str) => uint8ArrayFromString(str),
        alloc: (length, fill = 0) => new Uint8Array(length).fill(fill),
        allocUnsafe: (length) => new Uint8Array(length),
        concat: (arrs, length) => uint8ArrayConcat(arrs, length),
        writeInt32BE: (buf, value, offset) => {
            new DataView(buf.buffer, buf.byteOffset, buf.byteLength).setInt32(offset, value, false);
        }
    },
    Uint8ArrayList: {
        from: (str) => new Uint8ArrayList(uint8ArrayFromString(str)),
        alloc: (length, fill = 0) => new Uint8ArrayList(new Uint8Array(length).fill(fill)),
        allocUnsafe: (length) => new Uint8ArrayList(new Uint8Array(length)),
        concat: (arrs, length) => new Uint8ArrayList(...arrs),
        writeInt32BE: (buf, value, offset) => {
            const data = new Uint8Array(4);
            new DataView(data.buffer, data.byteOffset, data.byteLength).setInt32(offset, value, false);
            buf.write(data, offset);
        }
    }
};
Object.keys(tests).forEach(key => {
    const test = tests[key];
    describe(`it-pb-rpc ${key}`, () => {
        let w;
        before(async () => {
            w = itPbRpc(pair());
        });
        describe('length-prefixed', () => {
            it('lp varint', async () => {
                const data = test.from('hellllllllloooo');
                w.writeLP(data);
                const res = await w.readLP();
                assertBytesEqual(data, res);
            });
            it('lp fixed encode', async () => {
                const duplex = pair();
                const wrap = itPbRpc(duplex, { lengthEncoder: int32BEEncode });
                const data = test.from('hellllllllloooo');
                wrap.writeLP(data);
                const res = await wrap.read();
                const length = test.allocUnsafe(4);
                test.writeInt32BE(length, data.length, 0);
                const expected = test.concat([length, data]);
                assertBytesEqual(res, expected);
            });
            it('lp fixed decode', async () => {
                const duplex = pair();
                const wrap = itPbRpc(duplex, { lengthDecoder: int32BEDecode });
                const data = test.from('hellllllllloooo');
                const length = test.allocUnsafe(4);
                test.writeInt32BE(length, data.length, 0);
                const encoded = test.concat([length, data]);
                wrap.write(encoded);
                const res = await wrap.readLP();
                assertBytesEqual(res, data);
            });
            it('lp exceeds max length decode', async () => {
                const duplex = pair();
                const wrap = itPbRpc(duplex, { lengthDecoder: int32BEDecode, maxDataLength: 32 });
                const data = test.alloc(33, 1);
                const length = test.allocUnsafe(4);
                test.writeInt32BE(length, data.length, 0);
                const encoded = test.concat([length, data]);
                wrap.write(encoded);
                await expect(wrap.readLP()).to.eventually.be.rejectedWith(/message data too long/);
            });
            it('lp max length decode', async () => {
                const duplex = pair();
                const wrap = itPbRpc(duplex, { lengthDecoder: int32BEDecode, maxDataLength: 5000 });
                const data = test.allocUnsafe(4000);
                const length = test.allocUnsafe(4);
                test.writeInt32BE(length, data.length, 0);
                const encoded = test.concat([length, data]);
                wrap.write(encoded);
                const res = await wrap.readLP();
                assertBytesEqual(res, data);
            });
        });
        describe('plain data', () => {
            it('whole', async () => {
                const data = Buffer.from('ww');
                w.write(data);
                const res = await w.read(2);
                assertBytesEqual(res, data);
            });
            it('split', async () => {
                const data = Buffer.from('ww');
                const r = Buffer.from('w');
                w.write(data);
                const r1 = await w.read(1);
                const r2 = await w.read(1);
                assertBytesEqual(r, r1);
                assertBytesEqual(r, r2);
            });
        });
    });
});
//# sourceMappingURL=index.js.map