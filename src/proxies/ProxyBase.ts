import { createServer, Server, Socket } from 'net';
import { logger } from '../config/winston';

/**
 * TCP Server for incoming connections from local devices (e. g. an iPad)
 */
export abstract class ProxyBase {
  protected clientServer: Server;
  protected clientSocket: Socket;
  /**
   * Usually the official gameservers
   */
  protected abstract gameServerSocket: Socket;

  // Event handlers as curry function to avoid the 'lexical this' issue
  protected abstract onClientConnected: () => void;
  protected abstract onClientDataReceived: (data: Buffer) => void;
  protected abstract onGameServerDataReceived: (data: Buffer) => void;

  constructor() {
    this.clientServer = createServer((socket: Socket) => {
      logger.info('Client connected');
      this.clientSocket = socket;

      socket.on('data', this.onClientDataReceived);
      socket.on('close', this.onSocketClose);

      this.onClientConnected();
    });
    this.clientServer.on('listening', this.onServerStarted);
  }

  protected onSocketClose = (): void => {
    logger.info('Socket connection is fully closed');
  }

  private onServerStarted = (): void => {
    logger.info('TCP Server is listening on:', this.clientServer.address());
  }
}
