/* eslint-disable no-restricted-syntax */
const _random = require('lodash/random');
const { logger } = require('../utils');

const watchVideosInSequence = async (page, ipAddr, targetUrlsList, durationInSeconds) => {
  for (const url of targetUrlsList) {
    await page.goto(url, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });

    try {
      /** Close Login popup **/
      const dismissLogin = await page.$('#dismiss-button');
      await dismissLogin.click();
      /** Accept Cookie **/
      await page.waitForSelector('iframe', { timeout: 5000 });
      const elementHandle = await page.$('#iframe');
      const frame = await elementHandle.contentFrame();
      await frame.waitForSelector('#introAgreeButton');
      const introAgreeButton = await frame.$('#introAgreeButton > div.ZFr60d.CeoRYc');
      await introAgreeButton.click();
    } catch {
      logger.logFailedAttempt(url, ipAddr);
    }

    try {
      await page.waitForSelector('.view-count', { timeout: 5000 });
      await page.mouse.click(100, 100);
      const duration = (durationInSeconds + _random(-(durationInSeconds / 6), (durationInSeconds / 6), true));
      await page.waitForTimeout(duration * 1000);
      await logger.logCount(page, url, ipAddr, duration);
    } catch {
      logger.logFailedAttempt(url, ipAddr);
    }
  }
};

module.exports = { watchVideosInSequence };
