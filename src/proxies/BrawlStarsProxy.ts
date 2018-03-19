import { connect, Socket } from 'net';
import { config, IGameServerHost } from '../config/config';
import { logger } from '../config/winston';
import { MessageIds } from '../protocol/brawl-stars/BrawlStarsEnums';
import { BrawlStarsPacket } from '../protocol/brawl-stars/BrawlStarsPacket';
import { BrawlStarsPacketizer } from '../protocol/brawl-stars/BrawlStarsPacketizer';
import { ProxyBase } from './ProxyBase';

/**
 * Shows unencrypted packet metadata (packet length, packetids) and pipes the traffic
 */
export class BrawlStarsProxy extends ProxyBase {
  protected gameServerSocket: Socket;
  private gameServerCredentials: IGameServerHost;
  private clientPacketizer: BrawlStarsPacketizer;
  private serverPacketizer: BrawlStarsPacketizer;

  constructor() {
    super();

    this.clientPacketizer = new BrawlStarsPacketizer();
    this.serverPacketizer = new BrawlStarsPacketizer();
    this.clientPacketizer.packetEmitter.on('packet', this.onClientPacketReceived);
    this.serverPacketizer.packetEmitter.on('packet', this.onServerPacketReceived);
    this.gameServerCredentials = config.gameServers.brawlStars.production;
    this.clientServer.listen(this.gameServerCredentials.port, '0.0.0.0');
  }

  /**
   * Upon client connection, create a connection to the actual gameserver
   */
  protected onClientConnected = (): void => {
    this.gameServerSocket = connect(this.gameServerCredentials.port, this.gameServerCredentials.host);
    this.gameServerSocket.on('data', this.onGameServerDataReceived);
  }

  /**
   * Data from the game client (e. g. an iPad) has been received
   */
  protected onClientDataReceived = (chunk: Buffer): void => {
    this.clientPacketizer.addChunk(chunk);

    // Pass data to gameserver
    this.gameServerSocket.write(chunk);
  }

  /**
   * Data from the game servers has been received
   */
  protected onGameServerDataReceived = (chunk: Buffer): void => {
    this.serverPacketizer.addChunk(chunk);

    // Pass data to client
    this.clientSocket.write(chunk);
  }

  protected onClientPacketReceived = (parsedPacket: BrawlStarsPacket): void => {
    const packetName: string = MessageIds[parsedPacket.id];
    logger.info(`[Client - ${packetName} (${parsedPacket.id})] Length: ${parsedPacket.length}`);
  }

  protected onServerPacketReceived = (parsedPacket: BrawlStarsPacket): void => {
    const packetName: string = MessageIds[parsedPacket.id];
    logger.info(`[Server - ${packetName} (${parsedPacket.id})] Length: ${parsedPacket.length}`);
  }
}
