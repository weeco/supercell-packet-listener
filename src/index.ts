import { config } from './config/config';
import { logger } from './config/winston';
import { BrawlStarsProxy } from './proxies/BrawlStarsProxy';
import { ClashRoyaleProxy } from './proxies/ClashRoyaleProxy';
import { DNSServer } from './servers/DNSServer';

/**
 * Start servers
 */
DNSServer.start();

switch (config.startupOptions.proxyType) {
  case 'cr':
    logger.info('Starting Clash Royale proxy');
    const crProxy: ClashRoyaleProxy = new ClashRoyaleProxy();
    break;

  case 'bs':
    logger.info('Starting Brawl Stars proxy');
    const bsProxy: BrawlStarsProxy = new BrawlStarsProxy();
    break;

  default:
    throw new Error('Unknown proxy type');
}
