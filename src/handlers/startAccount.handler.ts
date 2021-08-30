/* @ts-ignore */
import _each from 'lodash/each';

import TorService from '../services/tor.service';
import * as YTBrowserService from '../services/accountBrowser.service';
import { logger } from '../utils';
import { IHandler } from '../interfaces/Accounts';

let successes = 0;
let failures = 0;
let total = 0;

const startAccountHandler = async (options: IHandler, index: number) => {
  await TorService.startTor();
  const promiseArr = [];
  for (let i = 0; i < options.batchCount; i += 1) {
    const port = options.startPort + i;
    // @ts-ignore
    promiseArr.push(YTBrowserService.accountYouTubeInBatch({ ...options, port }));
  }
  return Promise.allSettled(promiseArr).then((settedPromises) => {
    logger.info('Batch Summary -');
    // @ts-ignore
    _each(settedPromises, ({ status }, i) => {
      total += 1;
      if (status === 'fulfilled') successes += 1;
      else failures += 1;

      logger.info(`View ${index * options.batchCount + i + 1} - ${status}`);
      logger.info(`Fulfilled - ${successes}\t Failed - ${failures}\t Total - ${total}`);
    });
  });
};

export default startAccountHandler;
