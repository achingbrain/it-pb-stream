import { expect } from 'aegir/chai'
import { pair } from 'it-pair'
import { pbStream } from '../src/index.js'
import { int32BEEncode } from './fixtures/int32BE-encode.js'
import { int32BEDecode } from './fixtures/int32BE-decode.js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'
import { Uint8ArrayList } from 'uint8arraylist'
import { Buffer } from 'buffer'
import type { ProtobufStream } from '../src/index.js'
import { TestMessage } from './fixtures/test-message.js'
import { unsigned } from 'uint8-varint'
import toBuffer from 'it-to-buffer'
import map from 'it-map'

/* eslint-env mocha */
/* eslint-disable max-nested-callbacks */

const assertBytesEqual = (a: Uint8Array | Uint8ArrayList, b: Uint8Array | Uint8ArrayList): void => {
  a = a instanceof Uint8Array ? a : a.slice()
  b = b instanceof Uint8Array ? b : b.slice()

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      throw new Error(`Byte at index ${i} incorrect, expected ${a[i]}, got ${b[i]}`)
    }
  }
}

interface Test<T> {
  from: (str: string) => T
  alloc: (length: number, fill?: number) => T
  allocUnsafe: (length: number) => T
  concat: (arrs: T[], length?: number) => T
  writeInt32BE: (buf: T, value: number, offset: number) => void
}

const tests: Record<string, Test<any>> = {
  Buffer: {
    from: (str: string) => Buffer.from(str),
    alloc: (length: number, fill = 0) => Buffer.alloc(length, fill),
    allocUnsafe: (length: number) => Buffer.allocUnsafe(length),
    concat: (arrs: Buffer[], length?: number) => Buffer.concat(arrs, length),
    writeInt32BE: (buf: Buffer, value: number, offset: number) => buf.writeInt32BE(value, offset)
  },
  Uint8Array: {
    from: (str: string) => uint8ArrayFromString(str),
    alloc: (length: number, fill = 0) => new Uint8Array(length).fill(fill),
    allocUnsafe: (length: number) => new Uint8Array(length),
    concat: (arrs: Buffer[], length?: number) => uint8ArrayConcat(arrs, length),
    writeInt32BE: (buf: Buffer, value: number, offset: number) => {
      new DataView(buf.buffer, buf.byteOffset, buf.byteLength).setInt32(offset, value, false)
    }
  },
  Uint8ArrayList: {
    from: (str: string) => new Uint8ArrayList(uint8ArrayFromString(str)),
    alloc: (length: number, fill = 0) => new Uint8ArrayList(new Uint8Array(length).fill(fill)),
    allocUnsafe: (length: number) => new Uint8ArrayList(new Uint8Array(length)),
    concat: (arrs: Uint8ArrayList[], length?: number) => new Uint8ArrayList(...arrs),
    writeInt32BE: (buf: Uint8ArrayList, value: number, offset: number) => {
      const data = new Uint8Array(4)
      new DataView(data.buffer, data.byteOffset, data.byteLength).setInt32(offset, value, false)
      buf.write(data, offset)
    }
  }
}

Object.keys(tests).forEach(key => {
  const test = tests[key]

  describe(`it-pb-rpc ${key}`, () => {
    let w: ProtobufStream

    before(async () => {
      w = pbStream(pair<Uint8Array>())
    })

    it('unwraps underlying stream', () => {
      const stream = pair<Uint8Array>()
      const w = pbStream(stream)

      expect(w.unwrap()).to.equal(stream)
    })

    describe('length-prefixed', () => {
      it('lp varint', async () => {
        const data = test.from('hellllllllloooo')

        w.writeLP(data)
        const res = await w.readLP()
        assertBytesEqual(data, res)
      })

      it('lp fixed encode', async () => {
        const duplex = pair<Uint8Array>()
        const wrap = pbStream(duplex, { lengthEncoder: int32BEEncode })
        const data = test.from('hellllllllloooo')

        wrap.writeLP(data)
        const res = await wrap.read()
        const length = test.allocUnsafe(4)
        test.writeInt32BE(length, data.length, 0)
        const expected = test.concat([length, data])
        assertBytesEqual(res, expected)
      })

      it('lp fixed decode', async () => {
        const duplex = pair<Uint8Array>()
        const wrap = pbStream(duplex, { lengthDecoder: int32BEDecode })
        const data = test.from('hellllllllloooo')
        const length = test.allocUnsafe(4)
        test.writeInt32BE(length, data.length, 0)
        const encoded = test.concat([length, data])

        wrap.write(encoded)
        const res = await wrap.readLP()
        assertBytesEqual(res, data)
      })

      it('lp exceeds max length decode', async () => {
        const duplex = pair<Uint8Array>()
        const wrap = pbStream(duplex, { lengthDecoder: int32BEDecode, maxDataLength: 32 })
        const data = test.alloc(33, 1)
        const length = test.allocUnsafe(4)
        test.writeInt32BE(length, data.length, 0)
        const encoded = test.concat([length, data])

        wrap.write(encoded)

        await expect(wrap.readLP()).to.eventually.be.rejectedWith(/too long/)
      })

      it('lp max length decode', async () => {
        const duplex = pair<Uint8Array>()
        const wrap = pbStream(duplex, { lengthDecoder: int32BEDecode, maxDataLength: 5000 })
        const data = test.allocUnsafe(4000)
        const length = test.allocUnsafe(4)
        test.writeInt32BE(length, data.length, 0)
        const encoded = test.concat([length, data])

        wrap.write(encoded)
        const res = await wrap.readLP()
        assertBytesEqual(res, data)
      })
    })

    describe('plain data', () => {
      it('whole', async () => {
        const data = Buffer.from('ww')

        w.write(data)
        const res = await w.read(2)

        assertBytesEqual(res, data)
      })

      it('split', async () => {
        const data = Buffer.from('ww')

        const r = Buffer.from('w')

        w.write(data)
        const r1 = await w.read(1)
        const r2 = await w.read(1)

        assertBytesEqual(r, r1)
        assertBytesEqual(r, r2)
      })
    })

    describe('pb stream', () => {
      it('encode/decode', async () => {
        const input = {
          foo: 'bar'
        }

        w.writePB(input, TestMessage)

        const output = await w.readPB(TestMessage)

        expect(output).to.deep.equal(input)
      })

      it('supports pb streams', async () => {
        const input = {
          foo: 'bar'
        }

        const stream = w.pb(TestMessage)

        stream.write(input)
        const output = await stream.read()

        expect(output).to.deep.equal(input)
      })

      it('supports unwrapping pb streams', async () => {
        const stream = w.pb(TestMessage)

        expect(stream.unwrap()).to.equal(w)
      })

      it('reads remaining data from unwrapped stream in one buffer', async () => {
        const message = {
          foo: 'bar'
        }
        const messageBuf = TestMessage.encode(message)
        const extraData = Uint8Array.from([0, 1, 2, 3, 4, 5])

        const w = pbStream({
          source: (async function * () {
            yield uint8ArrayConcat([
              unsigned.encode(messageBuf.byteLength),
              messageBuf,
              extraData
            ])
          }()),
          sink: async () => {}
        })

        const read = await w.readPB(TestMessage)
        expect(read).to.deep.equal(message)

        const rest = await toBuffer(map(w.unwrap().source, (buf) => buf.subarray()))
        expect(rest).to.equalBytes(extraData)
      })

      it('reads remaining data from unwrapped stream in multiple buffers', async () => {
        const message = {
          foo: 'bar'
        }
        const messageBuf = TestMessage.encode(message)
        const extraData = Uint8Array.from([0, 1, 2, 3, 4, 5])

        const w = pbStream({
          source: (async function * () {
            yield unsigned.encode(messageBuf.byteLength)
            yield messageBuf
            yield extraData
          }()),
          sink: async () => {}
        })

        const read = await w.readPB(TestMessage)
        expect(read).to.deep.equal(message)

        const rest = await toBuffer(map(w.unwrap().source, (buf) => buf.subarray()))
        expect(rest).to.equalBytes(extraData)
      })
    })
  })
})
