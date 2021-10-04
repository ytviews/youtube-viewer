import { BrowserContext } from '../core/browser/BrowserContext';
import { Page } from '../core/browser/Page';
import devices from '../core/devices';
import { IPublicIp } from './PublicIp';

export abstract class BrowserPage {
    public browser: BrowserContext;
    protected url: string;
    protected name: string;
    protected publicIp?: IPublicIp;
    // @ts-ignore
    protected page: Page;

    constructor(browser: BrowserContext, name: string, url: string, publicIp?: IPublicIp) {
        this.browser = browser;
        this.name = name;
        this.url = url;
        this.publicIp = publicIp;
    }

    public async initialize() {
        this.page = await this.browser.newPage(this.name, this.url);
        await this.page.initialize();
        await this.page.emulate(devices['Desktop 1024x768']);
    }

    public async screenshot() {
        await this.page.screenshot(`${this.name}.png`);
    }

    public async close() {
        await this.page.close();
    }
}
