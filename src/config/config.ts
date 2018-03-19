import * as dotenv from 'dotenv';
import * as Joi from 'joi';

/**
 * Load env variables into config object
 */
dotenv.config();

// Validate env variables
const envVarsSchema: Joi.ObjectSchema = Joi.object({
  TCP_PROXY_HOST: Joi.string().required(),

  // GameServer configs
  BRAWL_STARS_PRODUCTION_SERVER_HOST: Joi.string().required(),
  BRAWL_STARS_PRODUCTION_SERVER_PORT: Joi.number().required(),

  CLASH_ROYALE_PRODUCTION_SERVER_HOST: Joi.string().required(),
  CLASH_ROYALE_PRODUCTION_SERVER_PORT: Joi.number().required(),

  // Startup options
  PROXY_TYPE: Joi.string().valid(['bs', 'cr']).required()
}).unknown().required();
const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error !== null) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config: IConfig = {
  tcpProxy: {
    host: envVars.TCP_PROXY_HOST
  },
  gameServers: {
    brawlStars: {
      production: {
        host: envVars.BRAWL_STARS_PRODUCTION_SERVER_HOST,
        port: Number(envVars.BRAWL_STARS_PRODUCTION_SERVER_PORT)
      }
    },
    clashRoyale: {
      production: {
        host: envVars.CLASH_ROYALE_PRODUCTION_SERVER_HOST,
        port: Number(envVars.CLASH_ROYALE_PRODUCTION_SERVER_PORT)
      }
    }
  },
  startupOptions: {
    proxyType: envVars.PROXY_TYPE
  }
};

export interface IConfig {
  tcpProxy: {
    host: string;
  };
  gameServers: {
    brawlStars: IGameServer;
    clashRoyale: IGameServer;
  };
  startupOptions: {
    proxyType: string;
  };
}

export interface IGameServer {
  production: IGameServerHost;
  stage?: IGameServerHost;
}

export interface IGameServerHost {
  host: string;
  port: number;
}
