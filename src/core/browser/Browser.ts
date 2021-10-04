import puppeteer from 'puppeteer-extra';
import { merge } from 'lodash';
import { Page, Viewport, LaunchOptions, connect } from 'puppeteer';
import { Browser as PuppeteerBrowser } from 'puppeteer';
import { PuppeteerExtra } from 'puppeteer-extra';
import Adblocker from 'puppeteer-extra-plugin-adblocker';
// @ts-ignore
import * as Stealth from 'puppeteer-extra-plugin-stealth';
// @ts-ignore
import * as AnonymizeUA from 'puppeteer-extra-plugin-anonymize-ua';
// @ts-ignore
import * as UserDataDir from 'puppeteer-extra-plugin-user-data-dir';
// @ts-ignore
import * as puppeteerPrefs from 'puppeteer-extra-plugin-user-preferences';
// @ts-ignore
import * as UserAgent from 'user-agents';
import { BrowserContext } from './BrowserContext';
import {
    IGNORE_HTTPS_ERRORS,
    CHROMIUM_EXECUTABLE_PATH,
    CHROMIUM_ARGS,
    TIMEOUT,
    defaultViewport,
    isProduction
} from '../../utils/constants';
import { logger } from '../../utils';
// import {f} from "@cliqz/adblocker-puppeteer";

process.setMaxListeners(Infinity);

// https://github.com/pierreminiggio/youtube-video-watcher/blob/master/watch.js
// https://github.com/simodev25/scraper-apis-kub/blob/master/job-scraper/src/scraper/lib/puppeteer.manager.ts
// https://github.com/appeiron-manager/webscraper/blob/main/src/scraper/scraper/scraper.controller.ts

// https://github.com/appeiron-manager/webscraper/blob/main/src/scraper/scraper/models/Browser.ts
// https://github.com/pierreminiggio/youtube-video-watcher/blob/master/watch.js
// https://github.com/rsoury/serverless-web-crawler/blob/master/lib/crawler.js

// https://github.com/xingxinglieo/Selenium

export type GoToOptions = Parameters<Page[ 'goto' ]>[ 1 ] & { retry?: number; };

export default class Browser {
    // @ts-ignore
    private puppeteerBrowser: PuppeteerBrowser;
    // @ts-ignore
    private puppeteer: PuppeteerExtra;
    defaultViewPort: Viewport;
    contexts: BrowserContext[];
    // @ts-ignore
    private readonly name: string
    private readonly port: number
    static timeout = TIMEOUT;

    constructor(name: string, port: number, public options: LaunchOptions & { defaultViewport?: Viewport; } = {}) {
        this.defaultViewPort = { ...defaultViewport, ...options.defaultViewport };
        this.name = name
        this.port = port;
        this.contexts = [];
        this.initPuppeteer()
    }

    private initPuppeteer() {
        // Setup puppeteer plugins
        // @ts-ignore
        this.puppeteer = puppeteer;
        this.puppeteer.use(Adblocker());
        this.puppeteer.use(Stealth())
        this.puppeteer.use(
            AnonymizeUA({
                makeWindows: false,
                stripHeadless: false,
                customFn() {
                    const ua = new UserAgent();
                    return ua.toString();
                }
            })
        );
        this.puppeteer.use(puppeteerPrefs({
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
        this.puppeteer.use(UserDataDir()); // Manages temp store and clean at launch/close for user data dir.
    }

    /**
     *
     * @param {LaunchOptions & {
        slowMo?: Number
        userDataDir?: String
        }} options
     */
    public async launch(options: LaunchOptions & {
        slowMo?: number;
        userDataDir?: string;
    } = {}) {
        if (isProduction) {
            CHROMIUM_ARGS.push(`--proxy-server=socks5://127.0.0.1:${this.port}`);
            logger.info(`Establishing Tor Proxy connection: ${this.port}`);
        }
        // @ts-ignore
        const browser = await this.puppeteer.launch(merge({
            args: CHROMIUM_ARGS,
            defaultViewport: this.defaultViewPort,
            headless: false,
            ignoreDefaultArgs: ['--mute-audio'],
            ignoreHTTPSErrors: IGNORE_HTTPS_ERRORS,
            timeout: Browser.timeout,
            devtools: !isProduction,
            executablePath: CHROMIUM_EXECUTABLE_PATH,
        }, this.options, options));

        this.puppeteerBrowser = await connect({
            browserWSEndpoint: browser.wsEndpoint(),
        });
    }

    async browserInstance(name: string, type: string) : Promise<BrowserContext> {
        const context: BrowserContext = await new BrowserContext(name, type, this.puppeteerBrowser);
        this.contexts.push(context);
        return context;
    }

    async close(){
        await this.puppeteerBrowser.close();
    }
}
