/* @ts-ignore */
import path from 'path';
/* @ts-ignore */
import fs from 'fs';
/* @ts-ignore */
import compact from 'lodash/compact';
/* @ts-ignore */
import isEmpty from 'lodash/isEmpty';
/* @ts-ignore */
import toString from 'lodash/toString';
/* @ts-ignore */
import * as logger from './logger';

export const keyWordReader = (filename: string) => {
  try {
    const fileContents = toString(fs.readFileSync(path.resolve(process.cwd(), filename), 'utf8'));
    const re = /\r?\n/;
    const removeBackLine = fileContents.split(re);
    const urlArray = compact(removeBackLine);
    if (isEmpty(urlArray)) throw new Error(`No urls found. Make sure ${filename} contains at least one url to proceed`);
    return urlArray;
  } catch (error) {
    logger.error('An error occurred while reading urls');
    logger.debug(error);
    throw new Error();
  }
};
