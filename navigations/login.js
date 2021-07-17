const { logger } = require('../utils');

async function navigatingLogin(page, selectors) {
  logger.info('NAVIGATING LOGIN');

  const { emailField, passField, submitBtn } = selectors;
  await page.goto('https://kingdomlikes.com/');
  logger.info('Entered kingdomlikes login page');
  await page.type(emailField, process.env.EMAIL);
  logger.info('Email field completed');
  await page.type(passField, process.env.PASSWORD);
  logger.info('Password field completed');
  logger.info('Submitting...');
  await page.click(submitBtn);
}

module.exports = navigatingLogin;
