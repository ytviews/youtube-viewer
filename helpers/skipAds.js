const { logger } = require('../utils');

let moHandler = {};

const skipAds = async (page) => {
  await page.evaluate(() => {
    moHandler = {
      changesObserver: (mutation) => {
        if (mutation.type === 'attributes') {
          if (
            mutation.target.className == 'ytp-ad-skip-button-container' ||
            mutation.target.className == 'style-scope ytd-button-renderer style-text size-default') {
            mutation.target.click();
          }
        }
      },
      subscriber: (mutations) => {
        mutations.forEach((mutation) => {
          moHandler.changesObserver(mutation);
        });
      },
      init: () => {
        // eslint-disable-next-line no-undef
        const target = document.documentElement;
        const config = {
          attributes: true,
        };
          // eslint-disable-next-line no-undef
        const mObserver = new MutationObserver(moHandler.subscriber);
        mObserver.observe(target, config);
      },
    };
    moHandler.init();
  });
};

module.exports = {
  skipAds,
};
