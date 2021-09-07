import { BrowserPage } from "../../interfaces/Browser";

export class PublicAddress extends BrowserPage {

    async processors() {
        await this.page.waitForTimeout(500);

        await Promise.all([
            this.page.loadPage({ waitUntil: 'load' }),
            this.page.waitForNavigation(),
            this.page.bringToFront(),
        ]);
        // @ts-ignore
        return await this.page.puppeteer.$eval('body', (body) => JSON.parse(body.innerText));
    }
}
