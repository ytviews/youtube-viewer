const { execWithPromise } = require('../utils/childProcessWrapper');

const { logger } = require('../utils');
const { isProduction } = require('../utils/constants');

const writeTorConfig = async (startPort, count) => {
  if (!isProduction) return Promise.resolve();
  logger.info('App running in production. Will use rotating proxy via TOR.');
  logger.info(' Writing Tor Config');
  await execWithPromise('touch /etc/tor/torrc && echo > /etc/tor/torrc');
  const promiseArr = [];
  for (let i = 0; i < count; i += 1) {
    const port = startPort + i;
    promiseArr.push(
        execWithPromise(
            `echo "SocksPort ${port}" >> /etc/tor/torrc`,
        ).then(() => logger.debug(`PORT ${port} written in tor config`)),
    );
  }
  return Promise.all(promiseArr).then(() => {
    logger.success('Tor Config written successfully.');
  }).catch((error) => {
    logger.error('One or more ports couldn\'t be written into tor config.');
    logger.debug(error);
    throw new Error();
  });
};

const stopTor = async () => {
  if (!isProduction) return;
  try {
    await execWithPromise('pkill -9 -f "tor"');
  } catch (error) {
    logger.warn('Failed to stop TOR. Usually this is a no op but ensure the subsequent attempts are using different IPs.');
    logger.debug(error);
  }
};

const startTor = async () => {
  if (!isProduction) return;
  logger.info('Starting TOR.');
  await stopTor();
  try {
    await execWithPromise('/usr/bin/tor --RunAsDaemon 1');
    logger.success('Started TOR successfully');
  } catch (error) {
    logger.error('Failed to start TOR.');
    logger.debug(error);
    throw new Error();
  }
};

module.exports = { writeTorConfig, stopTor, startTor };

/**
class TorNetworkProxy {
  constructor(torCfg) {
    this.torCfg = torCfg;
    this.setType(this.torCfg.Socks5Proxy);
    this.setHostName(this.torCfg.hostname);
    this.setPort(this.torCfg.socksPort);
  }
  url(self) {
    return `socks5://${this.torCfg.hostname}:${this.torCfg.socksPort}`;
  }
}
**/
