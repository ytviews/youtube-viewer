/* eslint-disable no-restricted-syntax */
const _random = require('lodash/random');
const { PuppeteerBlocker } = require('@cliqz/adblocker-puppeteer');
const fetch = require('cross-fetch');
const { logger } = require('../utils');
const {
  acceptCookie,
  dismissLogin,
  click,
  waitForSelector,
} = require('./selector');
const { skipAds } = require('./skipAds');

const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, (seconds || 1) * 1000));

const watchVideosInSequence = async (page, ipAddr, targetUrlsList, durationDefault) => {
  PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    blocker.enableBlockingInPage(page);
  });

  for (const target of targetUrlsList) {
    const durationInSeconds = target.duration | durationDefault;
    logger.info(`Duration Video: ${durationInSeconds}`);
    await page.goto(target.url, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });

    try {
      await sleep(2);
      /** Close Cookie popup **/
      await acceptCookie(page);
      // await click(page, 'AcceptCookie');
      // await click(page, 'closeCookie');

      /** Close Login popup **/
      await dismissLogin(page);
      /** Accept Cookie **/
      // await acceptCookie(page);
      /** Get play btn selector and click **/
      await page.waitForNavigation({
        waitUntil: 'networkidle2',
      });
      await sleep(1);
      // await waitForSelector(page, 'playerView');
      await click(page, 'playButton');
      /**
      // await click(page, 'playButton');
      await click('gdprButton');
      await click('dismissBullshitButton');
      await click('noThanksButton');
      await click('skipAdButton');
      await click('introAgreeButton');
      **/
      /** Skip all Ads **/
      await skipAds(page);
    } catch {
      logger.logFailedAttempt(target.url, ipAddr);
    }

    try {
      await page.waitForSelector('.view-count', { timeout: 5000 });
      await page.mouse.click(100, 100);
      const duration = (durationInSeconds + _random(-(durationInSeconds / 6), (durationInSeconds / 6), true));
      await page.waitForTimeout(duration * 1000);
      await logger.logCount(page, target.url, ipAddr, duration);
    } catch {
      logger.logFailedAttempt(target.url, ipAddr);
    }
  }
};

const searchVideosInSequence = async (page, ipAddr, targetWordList, durationDefault) => {
  PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    blocker.enableBlockingInPage(page);
  });
  const url = 'https://www.youtube.com';

  for (const keyword of targetWordList) {
    await page.goto(url, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
    const screenshot = 'youtube_fm_dreams_video.png';
    try {
      /** Close Cookie popup **/
      await click(page, 'closeCookie');
      await waitForSelector(page, 'searchBar', 5000);
      // before we do anything, parse the results of the front page of youtube
      // await page.waitForSelector('ytd-video-renderer,ytd-grid-video-renderer', { timeout: 50000 });
      const input = await page.$('input[id="search"]');
      // overwrites last text in input
      await input.click({ clickCount: 3 });
      await input.type(keyword, { delay: 100 });
      await input.focus();
      await page.keyboard.press('Enter');

      // await waitForSelector(page, 'playerView');
      // await page.waitForSelector('ytd-thumbnail.ytd-video-renderer');
      await page.waitForFunction(`document.title.indexOf('${keyword}') !== -1`, { timeout: 5000 });
      await waitForSelector(page, 'videoRenderer', 5000);
      await sleep(1);
      // await page.waitFor(3000);

      await page.screenshot({
        path: 'youtube_fm_dreams_list.png',
      });
      /**
      const videos = await page.$$('ytd-thumbnail.ytd-video-renderer');
      await videos[2].click();
      await page.waitForSelector('.html5-video-container');
      await page.waitFor(5000);
      await page.screenshot({
        path: screenshot,
      });
      **/
    } catch (e) {
      console.error(`Problem with scraping ${keyword}: ${e}`);
      // logger.logFailedAttempt(keyword, ipAddr);
    }
  }
};

module.exports = { watchVideosInSequence, searchVideosInSequence };
