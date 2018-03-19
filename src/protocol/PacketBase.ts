/**
 * Represents a Supercell packet
 */
export abstract class PacketBase {
  public id: number;
  public length: number;
  public unknown: number;
  public version: number;
  public payload: Buffer;

  constructor(id: number, length: number, unknown: number, version: number, payload: Buffer) {
    this.id = id;
    this.length = length;
    this.unknown = unknown;
    this.version = version;
    this.payload = payload;
  }
}
