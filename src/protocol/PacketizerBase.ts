import { EventEmitter } from 'events';

/**
 * Transforms data chunks to packets
 */
export abstract class PacketizerBase {
  public packetEmitter: EventEmitter;
  protected dataCache: Buffer;

  /**
   * Add network chunks to the stream so that we can parse full packets.
   * @param chunk Network chunk
   */
  public addChunk(chunk: Buffer): void {
    if (this.dataCache != null) {
      this.dataCache = Buffer.concat([this.dataCache, chunk]);
    } else {
      this.dataCache = chunk;
    }

    this.packetize();
  }

  protected abstract packetize(): void;
}
