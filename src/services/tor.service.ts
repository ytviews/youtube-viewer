import { execWithPromise } from '../utils/childProcessWrapper';
import { logger } from '../utils';
import { isProduction,
    START_PORT,
    BATCH_COUNT
} from '../utils/constants';

class Tor {
    private startPort: number
    private count: number
    constructor(startPort: number = START_PORT, count: number = BATCH_COUNT) {
        this.startPort = startPort
        this.count = count
    }

    public async writeTorConfig () {
        if (!isProduction) return Promise.resolve();
        logger.info('App running in production. Will use rotating proxy via TOR.');
        logger.info(' Writing Tor Config');
        await execWithPromise('touch /etc/tor/torrc && echo > /etc/tor/torrc');
        const promiseArr = [];
        for (let i = 0; i < this.count; i += 1) {
            const port = this.startPort + i;
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
    }

    public async stopTor () {
        if (!isProduction) return;
        try {
            await execWithPromise('pkill -9 -f "tor"');
        } catch (error) {
            logger.warn('Failed to stop TOR. Usually this is a no op but ensure the subsequent attempts are using different IPs.');
            logger.debug(error);
        }
    };

    public async startTor () {
        if (!isProduction) return;
        logger.info('Starting TOR.');
        await this.stopTor();
        try {
            await execWithPromise('/usr/bin/tor --RunAsDaemon 1');
            logger.success('Started TOR successfully');
        } catch (error) {
            logger.error('Failed to start TOR.');
            logger.debug(error);
            throw new Error();
        }
    };
}

const  TorService = new Tor()
export default TorService
