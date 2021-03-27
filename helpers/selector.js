const { logger } = require('../utils');

const selectors = {
  pageBody: 'body',
  iframe: 'iframe',
  gdprButton: 'button[aria-label^="Agree"]',
  introAgreeButton: '#introAgreeButton',
  playButton: 'button[aria-label="Play (k)"]',
  // playButton: '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > button[aria-label="Play (k)"]',
  noThanksButton: '#button[aria-label="No thanks"]',
  dismissBullshitButton: '#dismiss-button paper-button',
  consentIframe: 'iframe[src*="consent"]',
  consentForm: 'form[action*="consent"]',
  skipAdButton: 'button[class*="skip-button"]',
};
const _clicked = {};

const waitForSelector = async (page, sel = '', timeout = 2000) => {
  logger.info(`Waiting for ${sel}`);
  if (selectors[sel]) sel = selectors[sel];
  await page.waitForSelector(sel, { timeout });
};

const acceptCookie = async (page) => {
  await waitForSelector(page, 'iframe', 5000);
  const elementHandle = await page.$('#iframe');
  const frame = await elementHandle.contentFrame();
  await frame.waitForSelector('#introAgreeButton');
  const introAgreeButton = await frame.$('#introAgreeButton > div.ZFr60d.CeoRYc');
  await introAgreeButton.click();

  /**
  const frame = page.frames().find((frame, i) => frame.url().includes('consent'));
  if (frame) {
    let success = true;
    try {
      await frame.waitForSelector(selectors.consentForm, { timeout: 2000 });
    } catch (err) {
      success = false;
    }
    if (success) {
      logger.info('Submitting consent in iframe');
      await frame.$eval(selectors.consentForm, (form) => form.submit());
    }
  }
  **/
};

const dismissLogin = async (page) => {
  const dismissLogin = await page.$('#dismiss-button');
  await dismissLogin.click();
};

const click = async (page, sel = '', times = 1) => {
  logger.info(`Clicking "${sel}"`);
  if (selectors[sel]) sel = selectors[sel];
  if (_clicked[sel] >= times) return;
  let success = true;
  try {
    await page.click(sel);
  } catch (err) {
    success = false;
  }
  if (success) _clicked[sel] = (_clicked[sel] || 0) + 1;
  return success;
};

const quit = async (browser, code = 0, message = '') => {
  if (message) logger.info(message);
  await browser.close();
  process.exit(code);
};

const handleExit = async () => {
  await quit(0, 'Closing chrome, Good bye!');
};

module.exports = {
  quit,
  click,
  handleExit,
  acceptCookie,
  dismissLogin,
  waitForSelector,
};
