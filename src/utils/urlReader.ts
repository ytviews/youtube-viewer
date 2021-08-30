import * as path from 'path';
import { isEmpty } from 'lodash';
/* @ts-ignore */
import * as logger from './logger';

export const urlReader = (filename: string) => {
  try {
    const { list: accountsArray } = require(path.resolve(process.cwd(), filename));
    if (isEmpty(accountsArray)) throw new Error(`No urls found. Make sure ${filename} contains at least one url to proceed`);
    return accountsArray;
  } catch (error) {
    logger.error('An error occurred while reading urls');
    logger.debug(error);
    throw new Error();
  }
};
