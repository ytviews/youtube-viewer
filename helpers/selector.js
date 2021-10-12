const { logger } = require('../utils');

const selectors = {
  pageBody: 'body',
  iframe: 'iframe[name="passive_signin"]',
  gdprButton: 'button[aria-label^="Agree"]',
  introAgreeButton: '#introAgreeButton',
  playButton: 'button[aria-label="Play (k)"]',
  // playButton: '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > button[aria-label="Play (k)"]',
  closeCookie: 'button[jsname="higCR"]',
  noThanksButton: '#button[aria-label="No thanks"]',
  dismissBullshitButton: '#dismiss-button paper-button',
  consentIframe: 'iframe[src*="consent"]',
  consentForm: 'form[action*="consent"]',
  skipAdButton: 'button[class*="skip-button"]',
  playerView: 'div[id="player-container-inner]',
  searchBar: 'input[id="search"]',
  videoRenderer: 'ytd-video-renderer,ytd-grid-video-renderer',
  AcceptCookie: 'a[class*="yt-simple-endpoint style-scope ytd-button-renderer"]',
};
const _clicked = {};

const waitForSelector = async (page, sel = '', timeout = 2000) => {
  logger.info(`Waiting for ${sel}`);
  if (selectors[sel]) sel = selectors[sel];
  await page.waitForSelector(sel, { timeout });
};

const acceptCookie = async (page) => {
  logger.info('acceptCookie');
  // const elementHandle = await page.$x('(//a[@class*="yt-simple-endpoint style-scope ytd-button-renderer"])');
  // const elementHandle = await page.$x('(//div[@id="content", @class=".style-scope.ytd-consent-bump-v2-lightbox"])/a)');
  // const elementHandle = await page.$x('//div[contains(@class, "style-scope ytd-consent-bump-v2-lightbox")]/a');
  // const elementHandle = await page.$x('//*[contains(@id, "dialog")]');
  const elementHandle = await page.$$('#dialog.style-scope.ytd-consent-bump-v2-lightbox');
  elementHandle.map(async (element) => {
    const buttons = await element.$$('#button.style-scope.ytd-button-renderer.style-primary.size-default');
    buttons[1].click();
  });
  /**
  for (let element in elementHandle) {
    // const link = await elementHandle[element].$('a.yt-simple-endpoint.style-scope.ytd-button-renderer');
    // const link = await elementHandle[element].$('#button.style-scope.ytd-button-renderer.style-primary.size-default');
    const buttons = await page.$$('#button.style-scope.ytd-button-renderer.style-primary.size-default');
    // buttons.click();
    logger.info(buttons);
  }
  **/

  /**
  await waitForSelector(page, 'iframe', 5000);
  const elementHandle = await page.$('#iframe');
  const frame = await elementHandle.contentFrame();
  await frame.waitForSelector('#introAgreeButton');
  const introAgreeButton = await frame.$('#introAgreeButton > div.ZFr60d.CeoRYc');
  await introAgreeButton.click();

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
