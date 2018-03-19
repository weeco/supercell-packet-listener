import { A,
  createServer,
  IAnswer,
  IAuthority,
  IDNSEntry,
  IDNSPacket,
  IDNSPacketResponse,
  IDNSRecord,
  IQuestion,
  IRequest,
  Request,
  UDPServer
} from 'native-dns';
import { config } from '../config/config';
import { logger } from '../config/winston';

/**
 * DNS Server for manipulating the requested DNS entries so, that a game client uses your
 * computer's ip address instead of connecting to the official gameservers
 */
export module DNSServer {
  const authority: IAuthority = { address: '8.8.8.8', port: 53, type: 'udp' };
  const fakeDNSEntries: IDNSEntry[] = [
    {
      domain: '.*brawlstarsgame.*',
      records: [
        { type: 'A', address: config.tcpProxy.host, ttl: 1800 }
      ]
    },
    {
      domain: '.*clashroyaleapp.*',
      records: [
        { type: 'A', address: config.tcpProxy.host, ttl: 1800 }
      ]
    }
  ];

  /**
   * Starts the DNS Server
   */
  export function start(): void {
    logger.info('Creating DNS Server.');
    const dnsServer: UDPServer = createServer();
    dnsServer.on('listening', () => logger.info('DNS Proxy is listening on: ', dnsServer.address()));
    dnsServer.on('close', () => logger.info('DNS Server closed ', dnsServer.address()));
    dnsServer.on('error', (err: Error) => logger.error(err.stack));
    dnsServer.on('socketError', (err: Error) => logger.error('Socketerror:', err));
    dnsServer.on('request', handleRequest);

    dnsServer.serve(53, '0.0.0.0');
  }

  /**
   * Checks if we want to manipulate the requested DNS entry and sends a DNS response.
   *
   * If we want to manipulate the requested DNS entry then let's use our own response.
   * Otherwise request the actual DNS response from our authority (Google DNS) and return that.
   * @param request The DNS requested by the client
   * @param response The DNS response from our authority
   */
  async function handleRequest(request: IDNSPacket, response: IDNSPacketResponse): Promise<void> {
    const dnsRequests: Promise<{}>[] = [];

    // Iterate on all requested DNS entries and check if one of them is on our "fake dns list"
    request.question.forEach((question: IQuestion) => {
      const matchingEntries: IDNSEntry[] = fakeDNSEntries.filter((r: IDNSEntry) => new RegExp(r.domain, 'i').exec(question.name));
      if (matchingEntries.length === 0) {
        dnsRequests.push(proxy(question, response));
      } else {
        // Only use first entry (in case more than one rule has matched for this request we are going to pick the first match)
        matchingEntries[0].records.forEach((record: IDNSRecord) => {
          logger.info(`Fake proxying ${question.name}. Resolving to ${record.address}`);
          response.answer.push(A({
            address: record.address,
            type: record.type,
            ttl: 1800,
            name: question.name
          }));
        });
      }
    });

    await Promise.all(dnsRequests);
    response.send();
  }

  /**
   * Proxies the original request to our authority (Google DNS) without touching it.
   * @param question The requested domain
   * @param response DNS packet response, which we will send once we got all chunks
   */
  async function proxy(question: IQuestion, response: IDNSPacket): Promise<{}> {
    logger.info(`Proxying ${question.name}`);
    const request: IRequest = Request({
      question, // forwarding the question
      server: authority, // this is the DNS server we are asking
      timeout: 1000
    });

    // when we get answers, append them to the response
    // tslint:disable-next-line:variable-name
    request.on('message', (_err: Error, msg: IDNSPacket) => {
      msg.answer.forEach((a: IAnswer) => response.answer.push(a));
    });

    // tslint:disable-next-line:variable-name
    return new Promise((resolve: (value?: {} | PromiseLike<{}>) => void, _reject: (reason?: {}) => void): void => {
      request.on('end', resolve);
      request.send();
    });
  }
}
