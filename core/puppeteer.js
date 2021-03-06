const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const { IS_PROD } = require('../utils/constants');

puppeteer.use(stealthPlugin());

// In order to run chromium processes in parallel. https://github.com/puppeteer/puppeteer/issues/594#issuecomment-325919885
process.setMaxListeners(Infinity);

const args = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-infobars',
  '--window-position=0,0',
  '--ignore-certifcate-errors',
  '--ignore-certifcate-errors-spki-list',
  '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
];

const getBrowserInstance = async (port) => {
  if (IS_PROD) args.push(`--proxy-server=socks5://127.0.0.1:${port}`);

  const browser = await puppeteer.launch({
    args,
    devtools: !IS_PROD,
    executablePath: IS_PROD ? '/usr/bin/chromium-browser' : undefined,
    ignoreDefaultArgs: ['--mute-audio'],
    ignoreHTTPSErrors: true,
  });
  const incognitoBrowserContext = browser.createIncognitoBrowserContext();
  incognitoBrowserContext.close = browser.close;
  return incognitoBrowserContext;
};

module.exports = {
  getBrowserInstance,
};
