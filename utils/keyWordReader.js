const path = require('path');
const fs = require('fs');

const _compact = require('lodash/compact');
const _isEmpty = require('lodash/isEmpty');
const _toString = require('lodash/toString');

const logger = require('./logger');

const keyWordReader = (filename) => {
  try {
    const fileContents = _toString(fs.readFileSync(path.resolve(process.cwd(), filename)));
    const re = /(;|\n)/;
    const removeBackLine = fileContents.split(re);
    const urlArray = _compact(fileContents.urls);
    if (_isEmpty(urlArray)) throw new Error(`No urls found. Make sure ${filename} contains at least one url to proceed`);
    return urlArray;
  } catch (error) {
    logger.error('An error occurred while reading urls');
    logger.debug(error);
    throw new Error();
  }
};

module.exports = keyWordReader;
