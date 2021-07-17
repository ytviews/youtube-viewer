const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const PuppeteerExtra = require('puppeteer-extra');
const puppeteer = require('puppeteer');
const anonymizeUa = require('puppeteer-extra-plugin-anonymize-ua');
const puppeteerPrefs = require('puppeteer-extra-plugin-user-preferences');
const { IS_PROD } = require('../utils/constants');

PuppeteerExtra.use(stealthPlugin());
PuppeteerExtra.use(anonymizeUa());
PuppeteerExtra.use(puppeteerPrefs({
  userPrefs: {
    webkit: {
      webprefs: {
        default_font_size: 16,
      },
    },
    devtools: {
      preferences: {
        currentDockState: 'bottom',
      },
    },
  },
}));

// In order to run chromium processes in parallel. https://github.com/puppeteer/puppeteer/issues/594#issuecomment-325919885
process.setMaxListeners(Infinity);

const args = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-infobars',
  '--window-position=0,0',
  '--ignore-certifcate-errors',
  '--ignore-certifcate-errors-spki-list',
  '--autoplay-policy=no-user-gesture-required',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
  '--disable-crash-reporter',
  // This will write shared memory files into /tmp instead of /dev/shm,
  // because Docker’s default for /dev/shm is 64MB
  '--disable-dev-shm-usage',
  // '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
];

const getBrowserInstance = async (port) => {
  if (IS_PROD) args.push(`--proxy-server=socks5://127.0.0.1:${port}`);

  const browserr = await PuppeteerExtra.launch({
    args,
    devtools: !IS_PROD,
    executablePath: IS_PROD ? '/usr/bin/chromium-browser' : undefined,
    ignoreDefaultArgs: ['--mute-audio'],
    ignoreHTTPSErrors: true,
  });
  const browser = await puppeteer.connect({
    browserWSEndpoint: browserr.wsEndpoint(),
  });
  const incognitoBrowserContext = browser.createIncognitoBrowserContext();
  incognitoBrowserContext.close = browser.close;
  return incognitoBrowserContext;
};

module.exports = {
  getBrowserInstance,
};
