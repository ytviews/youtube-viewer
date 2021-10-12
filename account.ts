import TorService from './src/services/tor.service';
import startAccountHandler from './src/handlers/startAccount.handler';
// @ts-ignore
import {
  logger,
  urlReader,
  START_PORT,
  TOTAL_COUNT,
  BATCH_COUNT,
  URL_JSON_FILE_YOUTUBE,
} from './src/utils';

// https://github.com/try1975/RegBot
// https://github.com/ytviews/ProxyScraper
// https://github.com/Start9Labs/capacitor-tor
// https://github.com/Start9Labs/cups-shell
// https://github.com/pierreminiggio/youtube-video-watcher/blob/master/watch.js
// https://github.com/ResistancePlatform/resistance-desktop-wallet/blob/develop/app/service/tor-service.js
// https://github.com/viocost/islands-poc/blob/master/poc/VMpoc/CLIENTTOR1/clijs/tor-router/TorProcess.js
// https://github.com/s00d/onlinesim-js-api
// https://github.com/dragoroff/official/blob/master/Projects/gunshot-client/helpers/SignIn.js
//
async function main() {
  try {
    const accounts = urlReader(URL_JSON_FILE_YOUTUBE);
    logger.debug(`Preparing to generate ${TOTAL_COUNT} views. Target Account(s): ${JSON.stringify(accounts)}`);

    await TorService.writeTorConfig();

    for (let i = 0; i < Math.ceil(TOTAL_COUNT / BATCH_COUNT); i += 1) {
      await startAccountHandler({
        accounts,
        batchCount: BATCH_COUNT,
        startPort: START_PORT,
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
