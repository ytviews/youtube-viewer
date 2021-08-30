import { v4 } from 'uuid';
import { BrowserPage } from "../../interfaces/Browser";

export class Congolese extends BrowserPage {

    async processors() {
        await this.page.waitForTimeout(500);

        await Promise.all([
            this.page.loadPage({ waitUntil: 'load' }),
            this.page.waitForNavigation(),
            this.page.bringToFront(),
        ]);

        const CollectionNames = await this.page.puppeteer.evaluate(() => {
            const elements = document.getElementsByClassName('name-card');
            const e_a = [...elements]
            const arr = []
            e_a.map(e => {
                // @ts-ignore
                const cname = e.innerText
                    .replace(/\d+./g, '')
                    .trim()
                    .split(' ');
                arr.push({
                    firstName: cname[0],
                    lastName: cname[1],
                });
            });
            return arr
        });

        CollectionNames.map((name) => name['password'] = `${v4()}2021!`);

        return CollectionNames;
    }

}
