import {
    Browser as PuppeteerBrowser,
    BrowserContext as PuppeteerBrowserContext
} from 'puppeteer';
import { Page } from './Page';

export class BrowserContext {
    name: string;
    type: string;
    pages: Page[];
    puppeteerBrowserContext: PuppeteerBrowserContext;
    puppeteerBrowser: PuppeteerBrowser;

    constructor(type: string, name: string, puppeteerBrowser: PuppeteerBrowser){
        this.name = name;
        this.type = type;
        this.puppeteerBrowser = puppeteerBrowser;
        this.pages = [];
    }

    public async initialize(incognito?:boolean) {
        let incognitoBrowserContext
        if (incognito) {
            incognitoBrowserContext = await this.puppeteerBrowser.createIncognitoBrowserContext();
        } else {
            incognitoBrowserContext = this.puppeteerBrowser.defaultBrowserContext();
        }
        // @ts-ignore
        incognitoBrowserContext.close = this.puppeteerBrowser.close;
        // @ts-ignore
        this.puppeteerBrowserContext = incognitoBrowserContext;
    }

    public async newPage(name: string, url: string): Promise<Page> {
        const page: Page = new Page(name, url, this.puppeteerBrowserContext);
        this.pages.push(page);
        return page;
    }

    public async close() {
        await this.puppeteerBrowserContext.close();
    }
}
