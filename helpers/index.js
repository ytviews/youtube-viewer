/* eslint-disable no-restricted-syntax */
const _random = require('lodash/random');
const adBlocker = require('@cliqz/adblocker-puppeteer');
const fetch = require('cross-fetch');
const { logger } = require('../utils');
const {
  acceptCookie,
  dismissLogin,
  click,
  waitForSelector,
} = require('./selector');
const { skipAds } = require('./skipAds');

const { PuppeteerBlocker } = adBlocker;

const watchVideosInSequence = async (page, ipAddr, targetUrlsList, durationDefault) => {
  PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    blocker.enableBlockingInPage(page);
  });

  for (const target of targetUrlsList) {
    const durationInSeconds = target.duration | durationDefault;
    logger.info(`Duration Video: ${durationInSeconds}`);
    await page.goto(target.url, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });

    try {
      /** Close Login popup **/
      await dismissLogin(page);
      /** Accept Cookie **/
      await acceptCookie(page);
      /** Get play btn selector and click **/
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

module.exports = { watchVideosInSequence };
