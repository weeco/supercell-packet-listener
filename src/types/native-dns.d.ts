/**
 * Incomplete types for Native-DNS library
 */
/* tslint:disable */
declare module 'native-dns' {
  function createServer(opts?: IDNSServerOptions): UDPServer;
  function Request(opts: IRequestOptions): IRequest;
  function A(opts: { address: string; name: string; ttl: number; type: 'A' | 'AAAA' }): IAnswer;

  class UDPServer {
    public serve(port: number, adress: string, callback?: Function): void;
    public on(event: 'request', callback: RequestCallback): void;
    public on(event: string, callback: (...args: any[]) => void): void;
    public address(): string;
  }

  // Request function object
  interface IRequest {
    question: IQuestion;
    server: IAuthority;
    timeout: number;
    try_edns: boolean;
    cache: boolean;
    on(event: 'end', callback: () => void): void;
    on(event: 'error', callback: (err: Error) => void): void;
    on(event: 'timeout'): void;
    on(event: 'message', callback: (err: Error, msg: IDNSPacket) => void): void;
    send(): void;
  }

  interface IRequestOptions {
    question: IQuestion;
    server: string | IAuthority;
    timeout?: number;
    try_edns?: boolean;
    cache?: boolean;
  }

  type RequestCallback = (request: IDNSPacket, response: IDNSPacket) => void;

  interface IDNSPacket {
    address: {
      address: string;
      family: string;
      port: number;
      size: number;
    };
    question: IQuestion[];
    authority: IAuthority[];
    answer: IAnswer[];
  }

  interface IDNSPacketResponse extends IDNSPacket {
    send(): void;
  }

  interface IQuestion {
    class: number;
    name: string;
    type: number;
  }

  interface IAnswer {
    address: string;
    class: number;
    name: string;
    ttl: number;
    type: number;
  }

  interface IAuthority {
    address: string;
    port: number;
    type: 'udp' | 'tcp';
  }

  interface IDNSEntry {
    domain: string;
    records: IDNSRecord[];
  }

  interface IDNSRecord {
    type: 'A' | 'AAAA';
    address: string;
    ttl: number;
  }

  interface IDNSServerOptions {
    dgram_type?: 'udp4' | 'udp6';
  }
}
