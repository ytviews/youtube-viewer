import * as path from 'path';
// import fetch from 'cross-fetch';
// import { PuppeteerBlocker } from '@cliqz/adblocker-puppeteer';
import { shuffle, take } from 'lodash';
import Browser from '../core/browser/Browser';
import Account from '../core/accounts/Account';
import { BrowserContext } from '../core/browser/BrowserContext';
import { PublicAddress, YoutubeActions, Congolese } from '../helpers';
import { IPublicIp, ICollectionNames } from '../interfaces';
import { logger, sleep } from '../utils';
import {
  VIEW_ACTION_COUNT,
  YOUTUBE_LOGIN_URL,
  IP_GETTER_URL,
  CONGOLESE_GENRE,
  CONGOLESE_GETTER_URL,
} from '../utils/constants';


export const accountYouTubeInBatch = async ({ accounts, port }: any) => {
  let browser: Browser;
  try {
    const accountsForAction = take(shuffle(accounts), VIEW_ACTION_COUNT);
    const currentProfile = accountsForAction[Math.floor(Math.random() * accountsForAction.length)];
    const { email: username } = currentProfile;
    const currentProfileName = username.replace('@gmail.com', '');
    const userDataDir = path.join(__dirname, `../../.config/chromium/${currentProfileName}`);
    browser = new Browser('main', port);
    await browser.launch(
        {
          slowMo: 25,
          userDataDir, // "/Users/cws/Library/Application\ Support/Chromium/",
        }
    );
    const context: BrowserContext = await browser.browserInstance('main', 'default');
    await context.initialize();

    // Get IP Address
    const ipaddr: PublicAddress = new PublicAddress(context, 'ipaddr', IP_GETTER_URL);
    await ipaddr.initialize();

    const publicIp: IPublicIp = await ipaddr.processors();
    await ipaddr.screenshot();
    await ipaddr.close();
    logger.info(`Tor public IP: ${JSON.stringify(publicIp, null, 2)}`);

    // Congolese Names
    const congolese: Congolese = new Congolese(context, 'names', CONGOLESE_GETTER_URL);
    await congolese.initialize();
    const names: Array<ICollectionNames> = await congolese.processors();
    await congolese.screenshot();
    await congolese.close();

    const CollectionNames: Array<Account> = [];
    names.forEach(account => {
      CollectionNames.push(new Account(account, CONGOLESE_GENRE))
    });

    // YouTube
    const youtube: YoutubeActions = new YoutubeActions(context, 'youtube', YOUTUBE_LOGIN_URL, publicIp);
    await youtube.initialize();
    // Login to YouTube
    await youtube.processors(currentProfile, userDataDir);
    await sleep(5);

    // Create another YouTube Accounts
    await youtube.createAnotherYouTubeAccounts(CollectionNames);
    await youtube.screenshot();
    await youtube.close();

    /**
     PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
      blocker.enableBlockingInPage(youtube.puppeteer);
    });
     **/

  } catch (error) {
    logger.warn('Entire view action in a batch failed. Waiting for TOR to acquire a new set of IPs');
    logger.error(error);
  } finally {
    // @ts-ignore
    await browser.close();
  }
};
