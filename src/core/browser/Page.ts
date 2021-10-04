import {
    Page as PuppeteerPage,
    BrowserContext as PuppeteerBrowserContext,
    ElementHandle,
    WaitForOptions,
    HTTPResponse,
    Viewport,
    MouseButton
} from "puppeteer";
import { ResourceType } from '../../interfaces/ResourceType';
import * as puppeteer from 'puppeteer';
import {
    PAGE_DEFAULT_TIMEOUT
} from '../../utils/constants';
import { logger } from '../../utils';
import { Selectors, _clicked } from '../../helpers/selectors/Selectors';

export class Page {
    // @ts-ignore
    private puppeteerPage: PuppeteerPage;
    private puppeteerBrowserContext: PuppeteerBrowserContext;
    // @ts-ignore
    private name: string;
    private url: string;

    constructor(name: string, url: string, puppeteerBrowserContext: PuppeteerBrowserContext) {
        this.name = name;
        this.url = url;
        this.puppeteerBrowserContext = puppeteerBrowserContext;
    }

    async initialize(): Promise<void> {
        this.puppeteerPage = await this.puppeteerBrowserContext.newPage();
        this.puppeteerPage.setDefaultTimeout(PAGE_DEFAULT_TIMEOUT * 1000);
        await this.puppeteerPage.setBypassCSP(true);
        await this.puppeteerPage.setJavaScriptEnabled(true);

        const headlessUserAgent = await this.puppeteerPage.evaluate(() => navigator.userAgent);
        const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome');
        await this.puppeteerPage.setUserAgent(chromeUserAgent);
        await this.puppeteerPage.setExtraHTTPHeaders({
            'accept-language': 'fr-FR,fr;q=0.8'
        });
        // @ts-ignore
        this.puppeteerPage.on('error', this.handlePageCrash);
        // @ts-ignore
        this.puppeteerPage.on('pageerror', this.handlePageCrash);
        this.puppeteerPage.on('console', log => logger.browser(log.text()));
    }

    async goto(url: string, options?: WaitForOptions & {
        referer?: string;
    }): Promise<HTTPResponse> {
        return  this.puppeteerPage.goto(url, options);
    }

    async loadPage(options?: WaitForOptions & {
        referer?: string;
    }): Promise<void> {
        await this.goto(this.url, options);
    }

    async requestInterception(state: boolean): Promise<void>{
        await this.puppeteerPage.setRequestInterception(state);
    }

    async interceptRequestsOn(type: ResourceType): Promise<void> {
        this.puppeteerPage.on('request', (request) => {
            if (request.resourceType() !== type) {
                request.continue();
            } else {
                request.abort();
            }
        });
    }

    async getImagesUrls(): Promise<string[]> {
        const links: string[] = [];
        this.puppeteerPage.on('response', async (response) => {
            const matches = /.*\.(jpg|png|svg|gif).(quality).*$/.exec(response.url());
            if (matches) {
                logger.info("ScraperController -> matches", matches)
                links.push(matches.input);
            }
        });
        return links;
    }

    async input(selector: string, keyword: string, options?: { delay: number }, press?: boolean) {
        logger.info(`Typing "${keyword}", Press Enter: ${press}`);
        if (Selectors[selector]) selector = Selectors[selector];
        // @ts-ignore
        const input: ElementHandle = await this.puppeteerPage.$(selector);
        // overwrites last text in input
        await input.click({ clickCount: 3 });
        await input.type(keyword, options);
        await input.focus();
        if (press)
            await this.puppeteerPage.keyboard.press('Enter');
    }

    async select(selector: string, ...values: string[]): Promise<string[]> {
        logger.info(`Selecting "${selector}"`);
        if (Selectors[selector]) selector = Selectors[selector];
        return this.puppeteerPage.select(selector, ...values);
    }

    async click(selector: string, options?: {
        delay?: number;
        button?: MouseButton;
        clickCount?: number;
    }, times = 1): Promise<boolean|undefined> {
        logger.info(`Clicking "${selector}"`);
        if (Selectors[selector]) selector = Selectors[selector];
        if (_clicked[selector] >= times) return;
        let success = true;
        try {
            await this.puppeteerPage.click(selector, options);
        } catch (err) {
            success = false;
        }
        if (success) _clicked[selector] = (_clicked[selector] || 0) + 1;
        return success;
    }

    async waitForTimeout(milliseconds: number): Promise<void> {
        await this.puppeteerPage.waitForTimeout(milliseconds);
    }

    async pressKeyboard(keyName: puppeteer.KeyInput, options?:{ delay?:number, text?:string }): Promise<void> {
        await this.puppeteerPage.keyboard.press(keyName, options);
    }

    async searchElement(elementName: string): Promise<ElementHandle<Element> | null> {
        return await this.puppeteerPage.$(elementName);
    }

    async searchAllElements(elementName: string): Promise<ElementHandle[]>{
        return await this.puppeteerPage.$$(elementName);
    }

    async waitForSelector(selector: string, options?: { visible?: boolean; hidden?: boolean; timeout?: number; }):
        Promise<ElementHandle | null> {
        logger.info(`Waiting for ${selector}`);
        if (Selectors[selector]) selector = Selectors[selector];
        return await this.puppeteerPage.waitForSelector(selector, options);
    }

    async waitForSelectorLoaded(selector: string, visible: boolean): Promise<void> {
        await this.puppeteerPage.waitForSelector(selector, {visible: visible});
    }

    async waitForNavigation(options?: WaitForOptions) {
        await this.puppeteerPage.waitForNavigation(options);
    }

    async bringToFront(): Promise<void>{
        await this.puppeteerPage.bringToFront();
    }

    async screenshot(pathName: string): Promise<Buffer | string | void>{
        return await this.puppeteerPage.screenshot({path: pathName});
    }

    async clickOnElement(element: ElementHandle<Element>) {
        const rect = await this.puppeteerPage.evaluate(el => {
            const { top, left, width, height } = el.getBoundingClientRect();
            return { top, left, width, height };
        }, element);

        // Use given position or default to center
        const _x = rect.width / 2;
        const _y = rect.height / 2;

        await this.puppeteerPage.mouse.click(rect.left + _x, rect.top + _y);
    }

    async emulate(options: {
        viewport: Viewport;
        userAgent: string;
    }): Promise<void> {
        return this.puppeteerPage.emulate(options)
    }

    async close(options?: {
        runBeforeUnload?: boolean;
    }): Promise<void> {
        return this.puppeteerPage.close(options)
    }

    handlePageCrash(error: string): void {
        logger.error('Browser page crashed');
        logger.debug(error);
        this.puppeteerPage.close();
    }

    get puppeteer(): PuppeteerPage {
        return this.puppeteerPage;
    }
}
