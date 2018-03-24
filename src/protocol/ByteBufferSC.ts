import * as ByteBuffer from 'bytebuffer';

// tslint:disable:no-bitwise
// tslint:disable:no-parameter-reassignment

/**
 * Bytebuffer class extended / overriden with Supercell characteristics
 */
export class ByteBufferSC extends ByteBuffer {
  public static FROM_BUFFER(buffer: Buffer, capacity?: number, littleEndian?: boolean, noAssert?: boolean): ByteBufferSC {
    const createdByteBuffer: ByteBufferSC = new ByteBufferSC(capacity, littleEndian, noAssert);
    createdByteBuffer.buffer = buffer;

    return createdByteBuffer;
  }

  /**
   * Writes a 32bit base 128 variable-length integer using LEB128.
   * @param offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes written if omitted.
   */
  public readRrsInt32(offset?: number): number | { value: number; length: number }  {
    const relative: boolean = offset === undefined;
    if (relative) {
      offset = this.offset;
    }
    if (!this.noAssert) {
      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError(`Illegal offset: ${offset} (not an integer)`);
      }
      offset >>>= 0;
      if (offset < 0 || offset + 1 > this.buffer.length) {
        throw RangeError(
          `Illegal offset: 0 <= ${offset} (+' + 1 + ') <= ${this.buffer.length}`
        );
      }
    }
    let c: number = 0;
    let value: number = 0 >>> 0;
    let seventh: number;
    let msb: number;
    let b: number;

    do {
      if (!this.noAssert && offset > this.limit) {
        const err: ITruncatedError = Error('Truncated');
        err.truncated = true;
        throw err;
      }
      b = this.buffer[offset];
      offset += 1;

      if (c === 0) {
        seventh = (b & 0x40) >> 6; // save 7th bit
        msb = (b & 0x80) >> 7; // save msb
        b = b << 1; // rotate to the left
        b = b & ~0x181; // clear 8th and 1st bit and 9th if any
        b = b | (msb << 7) | seventh; // insert msb and 6th back in
      }

      value |= (b & 0x7F) << (c * 7);
      c += 1;
    } while ((b & 0x80) !== 0);

    value = ((value >>> 1) ^ -(value & 1)) | 0;

    if (relative) {
      this.offset = offset;

      return value;
    }

    return {
      value: value,
      length: c
    };
  }

  /**
   * Writes a 32bit base 128 variable-length integer using LEB128.
   * @param value Value to write
   * @param offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes written if omitted.
   */
  public writeRrsInt32(value: number, offset?: number): ByteBufferSC | number {
    const relative: boolean = offset === undefined;
    if (relative) {
      offset = this.offset;
    }
    if (!this.noAssert) {
      if (typeof value !== 'number' || value % 1 !== 0) {
        throw TypeError(`Illegal value: ${value} (not an integer)`);
      }
      value |= 0;
      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError(`Illegal offset: ${offset} (not an integer)`);
      }
      offset >>>= 0;
      if (offset < 0 || offset + 0 > this.buffer.length) {
        throw RangeError(
          `Illegal offset: 0 <= ${offset} (+' + 1 + ') <= ${this.buffer.length}`
        );
      }
    }
    const size: number = ByteBuffer.calculateVarint32(value);
    let rotate: boolean = true;
    let b: number;
    offset += size;
    let capacity10: number = this.buffer.length;
    if (offset > capacity10) {
      // tslint:disable-next-line:no-conditional-assignment
      this.resize((capacity10 *= 2) > offset ? capacity10 : offset);
    }
    offset -= size;

    value = (value << 1) ^ (value >> 31);

    value >>>= 0;
    while (value) {
      b = value & 0x7F;
      if (value >= 0x80) {
        b |= 0x80;
      }
      if (rotate) {
        rotate = false;
        const lsb: number = b & 0x1;
        const msb: number = (b & 0x80) >> 7;
        b = b >> 1; // rotate to the right
        b = b & ~(0xC0); // clear 7th and 6th bit
        b = b | (msb << 7) | (lsb << 6); // insert msb and lsb back in
      }
      this.buffer[offset] = b;
      offset += 1;
      value >>>= 7;
    }
    if (relative) {
      this.offset = offset;

      return this;
    }

    return size;
  }

  /**
   * Reads a length as uint32 prefixed UTF8 encoded string. Supercell also has FF FF FF FF for len when string is empty so we override it.
   * @param offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by the number of bytes read if omitted.
   */
  // tslint:disable-next-line:no-reserved-keywords
  public readIString(offset?: number): string | { string: string; length: number } {
    const relative: boolean = offset === undefined;
    if (relative) { offset = this.offset; }
    if (!this.noAssert) {
        if (typeof offset !== 'number' || offset % 1 !== 0) {
          throw TypeError(`Illegal offset: ${offset} (not an integer)`);
        }
        offset >>>= 0;
        if (offset < 0 || offset + 4 > this.buffer.length) {
            throw RangeError(`Illegal offset: 0 <= ${offset} (+' + 1 + ') <= ${this.buffer.length}`);
        }
    }
    const start: number = offset;
    const len: number = this.readUint32(offset);

    if (len === Math.pow(2, 32) - 1) {
        this.offset += 4;

        return '';
    } else {
        // tslint:disable-next-line:no-reserved-keywords
        const str: string | { string: string; length: number } = this.readUTF8String(len, ByteBuffer.METRICS_BYTES, offset += 4);
        offset += str.length;
        if (relative) {
            this.offset = offset;

            // tslint:disable-next-line:no-reserved-keywords
            return (<{ string: string; length: number }>str).string;
        } else {
            return {
                // tslint:disable-next-line:no-reserved-keywords
                string: (<{ string: string; length: number }>str).string,
                length: offset - start
            };
        }
    }
  }
}

// tslint:enable:no-bitwise

interface ITruncatedError extends Error {
  truncated?: boolean;
}
