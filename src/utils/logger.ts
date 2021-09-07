// https://github.com/mbuyakov/SUI.CORE/blob/master/js/SUI.ALL/src/ioc/utils/Logger.ts
import * as chalk from 'chalk';
import { Page } from "puppeteer";
import { isProduction, SHOULD_FORCE_DEBUG_LOGS } from './constants';

const store: any = {};

const browser = (...message: string[]) => console.log(`${chalk.yellow.inverse(` [${(new Date()).toLocaleTimeString()}] - BROWSER `)} ${chalk.yellow(...message)}`);
const info = (...message: any[]) => console.log(`${chalk.white.inverse(` [${(new Date()).toLocaleTimeString()}] - INFO    `)} ${chalk.white(...message)}`);
const error = (...message: any[]) => console.log(`${chalk.red.inverse(` [${(new Date()).toLocaleTimeString()}] - ERROR   `)} ${chalk.red(...message)}`);
const success = (...message: any[]) => console.log(`${chalk.green.inverse(` [${(new Date()).toLocaleTimeString()}] - SUCCESS `)} ${chalk.green(...message)}`);
const debug = (...message: any[]) => {
  if (!SHOULD_FORCE_DEBUG_LOGS && isProduction) return;
  console.log(`${chalk.magenta.inverse(` [${(new Date()).toLocaleTimeString()}] - DEBUG   `)} ${chalk.magenta(...message)}`);
};
const warn = (...message: string[]) => console.log(`${chalk.yellow.inverse(` [${(new Date()).toLocaleTimeString()}] - WARN    `)} ${chalk.yellow(...message)}`);
const logFailedAttempt = (url: string, ipAddr: string) => {
  warn(`An attempt to view ${url} with IP: ${ipAddr} was probably blocked.`);
};

const logCount = async (page: Page, url: string, ipAddr: string, duration: string) => {
  try {
    const currentLiveViewCount = await page.$eval('.view-count', (viewCountNode: any) =>
        viewCountNode.innerText.replace(/[^0-9]/g, ''));
    if (!store[url]) store[url] = { initial: currentLiveViewCount };
    store[url].current = currentLiveViewCount;
    store[url].added = store[url].current - store[url].initial;
    success(`Attempted ${url} with IP: ${ipAddr} for ${duration} seconds. (Init View Count: ${store[url].initial} Current View Count: ${store[url].current} Views added this session: ${store[url].added})`);
  } catch {
    logFailedAttempt(url, ipAddr);
  }
};

export = {
  logCount,
  logFailedAttempt,
  browser,
  info,
  error,
  warn,
  success,
  debug,
};
