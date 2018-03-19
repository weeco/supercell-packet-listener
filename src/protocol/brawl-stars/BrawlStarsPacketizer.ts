import { EventEmitter } from 'events';
import { PacketizerBase } from '../PacketizerBase';
import { BrawlStarsPacket } from './BrawlStarsPacket';

/**
 * Packetizer for Brawl Stars
 */
export class BrawlStarsPacketizer extends PacketizerBase {
  constructor() {
    super();
    this.packetEmitter = new EventEmitter();
  }

  protected packetize(): void {
    const dataCache: Buffer = this.dataCache;
    const packetId: number = dataCache.readInt16BE(0);
    const length: number = dataCache.readIntBE(2, 3);
    const unknown: number = dataCache.readInt8(5);
    const version: number = dataCache.readInt8(6);
    const endByteIndex: number = length + 7;

    // Packet is not complete yet, we got to wait for more chunks
    if (endByteIndex > this.dataCache.length) {
      return;
    }

    // Slice the full packet out of the data cache
    this.dataCache = dataCache.slice(endByteIndex);

    const payload: Buffer = dataCache.slice(7, endByteIndex); // Still encrypted
    const parsedPacket: BrawlStarsPacket = new BrawlStarsPacket(packetId, length, unknown, version, payload);
    this.packetEmitter.emit('packet', parsedPacket);

    // If this chunk potentially brought more than one packet we got to check the others as well!
    if (this.dataCache.length >= 7) {
      this.packetize();
    }
  }
}
