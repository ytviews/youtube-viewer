const path = require('path');
const _isEmpty = require('lodash/isEmpty');

const logger = require('./logger');

const urlReader = (filename) => {
  try {
    const { urls: urlArray } = require(path.resolve(process.cwd(), filename));
    if (_isEmpty(urlArray)) throw new Error(`No urls found. Make sure ${filename} contains at least one url to proceed`);
    return urlArray;
  } catch (error) {
    logger.error('An error occurred while reading urls');
    logger.debug(error);
    throw new Error();
  }
};

module.exports = urlReader;
