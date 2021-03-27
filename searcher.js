// https://github.com/alikil/Pupetteer_YoutubeSession
const TorService = require('./services/tor.service');
const startSearchingHandler = require('./handlers/startSearching.handler');
const { logger, keyWordReader } = require('./utils');
const {
  START_PORT,
  TOTAL_COUNT,
  BATCH_COUNT,
  URL_KEYS_WORDS_FILE_NAME,
} = require('./utils/constants');

async function main() {
  try {
    const targetWords = keyWordReader(URL_KEYS_WORDS_FILE_NAME);
    logger.info(`Preparing to generate ${TOTAL_COUNT} views.`);
    await TorService.writeTorConfig(START_PORT, BATCH_COUNT);

    for (let i = 0; i < Math.ceil(TOTAL_COUNT / BATCH_COUNT); i += 1) {
      await startSearchingHandler({
        targetWords, batchCount: BATCH_COUNT, startPort: START_PORT,
      }, i);
    }
    await TorService.stopTor();
  } catch {
    logger.error('Failed to initialise. There should be an additional error message logged above.');
  } finally {
    process.exit(1); // container restarts with non zero exit
  }
}

main();
