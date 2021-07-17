const _each = require('lodash/each');

const TorService = require('../services/tor.service');
const YTBrowserService = require('../services/searcherBrowser.service');
const { logger } = require('../utils');

let successes = 0;
let failures = 0;
let total = 0;

const startSearchingHandler = async (options, index) => {
  await TorService.startTor();
  const SearchPromiseArr = [];
  for (let i = 0; i < options.batchCount; i += 1) {
    const port = options.startPort + i;
    SearchPromiseArr.push(YTBrowserService.searcherVideosInBatch({ ...options, port }));
  }
  return Promise.allSettled(SearchPromiseArr).then((settedPromises) => {
    logger.info('Batch Summary -');
    _each(settedPromises, ({ status }, i) => {
      total += 1;
      if (status === 'fulfilled') successes += 1;
      else failures += 1;

      logger.info(`View ${index * options.batchCount + i + 1} - ${status}`);
      logger.info(`Fulfilled - ${successes}\t Failed - ${failures}\t Total - ${total}`);
    });
  });
};

module.exports = startSearchingHandler;
