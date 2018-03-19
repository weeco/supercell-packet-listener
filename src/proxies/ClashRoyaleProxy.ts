import { connect, Socket } from 'net';
import { config, IGameServerHost } from '../config/config';
import { logger } from '../config/winston';
import { MessageIds } from '../protocol/clash-royale/ClashRoyaleEnums';
import { ClashRoyalePacket } from '../protocol/clash-royale/ClashRoyalePacket';
import { ClashRoyalePacketizer } from '../protocol/clash-royale/ClashRoyalePacketizer';
import { ProxyBase } from './ProxyBase';

/**
 * Shows unencrypted packet metadata (packet length, packetids) and pipes the traffic
 */
export class ClashRoyaleProxy extends ProxyBase {
  protected gameServerSocket: Socket;
  private gameServerCredentials: IGameServerHost;
  private clientPacketizer: ClashRoyalePacketizer;
  private serverPacketizer: ClashRoyalePacketizer;

  constructor() {
    super();

    this.clientPacketizer = new ClashRoyalePacketizer();
    this.serverPacketizer = new ClashRoyalePacketizer();
    this.clientPacketizer.packetEmitter.on('packet', this.onClientPacketReceived);
    this.serverPacketizer.packetEmitter.on('packet', this.onServerPacketReceived);
    this.gameServerCredentials = config.gameServers.clashRoyale.production;
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

  protected onClientPacketReceived = (parsedPacket: ClashRoyalePacket): void => {
    const packetName: string = MessageIds[parsedPacket.id];
    logger.info(`[Client - ${packetName} (${parsedPacket.id})] Length: ${parsedPacket.length}`);
  }

  protected onServerPacketReceived = (parsedPacket: ClashRoyalePacket): void => {
    const packetName: string = MessageIds[parsedPacket.id];
    logger.info(`[Server - ${packetName} (${parsedPacket.id})] Length: ${parsedPacket.length}`);
  }
}
