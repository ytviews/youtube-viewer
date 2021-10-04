/**
import fs from 'fs-extra';
import * as path from 'path'
import crypto from 'crypto'
**/
import * as fs from 'fs';
import { isEmpty } from 'lodash';
import { Protocol } from 'puppeteer';
import Account from '../../core/accounts/Account'
import { BrowserPage, IAccountsForAction } from '../../interfaces';
import { logger, sleep, Json } from '../../utils';
import { URL_JSON_FILE_YOUTUBE_ACCOUNTS } from '../../utils/constants';
// import {f} from "@cliqz/adblocker-puppeteer";
// https://onlinesim.ru/api/getFreeList?lang=en&country=33&page=1&number=752172852&subkey=7ac0d7f083325b8e487b136fe06d59af

export class YoutubeActions extends BrowserPage {

    private async loggedCheck () {
        try {
            await this.page.waitForSelector(
                'input[id="search"][name="search_query"]',
                { visible: true, timeout: 10000 }
            );
            return true;
        } catch(err) {
            return false;
        }
    }

    private async writeCookies(cookiesPath: string) {
        /**
        const client = await this.page.puppeteer.target().createCDPSession();
        // This gets all cookies from all URLs, not just the current URL
        const cookies = (await client.send('Network.getAllCookies'))['cookies'];
        **/
        const cookies: Protocol.Network.Cookie[] = await this.page.puppeteer.cookies();
        logger.info(JSON.stringify(cookies))
        logger.info("Saving", cookies.length, "cookies");
        fs.writeFileSync(cookiesPath, JSON.stringify(cookies));
    }

    private async restoreCookies(cookiesPath: string): Promise<Promise<Protocol.Network.Cookie[]> | null> {
        let cookies: Protocol.Network.Cookie[] = [];
        try {
            // @ts-ignore
            cookies = JSON.parse(fs.readFileSync(cookiesPath));
            logger.info("Loading", cookies.length, "cookies into browser");
            return cookies
        } catch (err) {
            logger.error("Restore cookie error: ", err);
            await this.writeCookies(cookiesPath);
            return cookies
        }
    }

    public async processors(account: IAccountsForAction, userProfileDir: string) {
        const cookiesStoreFile = `${userProfileDir}/Cookies/${account.email.replace('@', '(at)')}.json`;
        let isLogged = false;
        let userCookies: Protocol.Network.Cookie[] | null = await this.restoreCookies(cookiesStoreFile);
        await this.page.waitForTimeout(500);

        try {
            if (!isEmpty(userCookies)) {
                logger.info('Trying to use cached cookies...')
                // @ts-ignore
                await this.page.puppeteer.setCookie(...userCookies);
            }

            await Promise.all([
                this.page.loadPage({ waitUntil: 'load' }),
                this.page.waitForNavigation(),
                this.page.bringToFront(),
            ]);
            isLogged = await this.loggedCheck();

            if (!isLogged) {
                logger.info(`Cookies from the cache didn't work. Try to log in.`);
                /** Pressing the Sign in button. **/
                /**
                 // await this.page.puppeteer.waitForSelector('ytd-button-renderer.style-scope:nth-child(3) > a:nth-child(1)')
                 // await this.page.puppeteer.$eval('ytd-button-renderer.style-scope:nth-child(3) > a:nth-child(1)', (button) => button.click())
                 // await this.page.puppeteer.waitForNavigation();
                 **/

                /** Wait for email input. **/
                await this.page.waitForSelector('identifierId');

                /** Enter login. **/
                await this.page.input('identifierId', account.email, {
                    delay: 120,
                }, true);
                await this.page.waitForSelector('identifierNext');

                /** Enter password. **/
                await this.page.waitForSelector('#password input[type="password"]', { visible: true });
                await this.page.input('#password input[type="password"]', account.password, {
                    delay: 100,
                }, true);
                /**
                 // @ts-ignore
                 await this.page.puppeteer.$eval('#passwordNext > div > button', (button) => button.click());
                 **/
                await this.page.waitForNavigation();

                const submitApproveAccess = await this.page.puppeteer.evaluate(() =>
                    document.querySelector('#submit_approve_access') !== null
                );

                if (submitApproveAccess) {
                    await this.page.waitForSelector('#submit_approve_access', { visible: true, timeout: 100 });
                    await this.page.click('#submit_approve_access', {delay: 100});
                }

                isLogged = await this.loggedCheck();
            }
        } catch (e) {
            console.error(`Problem with scraping ${account.email}: ${e}`);
            // @ts-ignore
            logger.logFailedAttempt(account.email, this.publicIp.ip);
        }

        if (isLogged) {
            // Get cookies and refresh them in store cache
            logger.info(`Saving new cookies to cache...`);
            await this.writeCookies(cookiesStoreFile);
        }
    }

    public async createAnotherYouTubeAccounts(CollectionNames: Array<Account>) {

        let successSign: boolean = false

        // @ts-ignore
        for (const account of CollectionNames) {
            const navigationPromise = this.page.puppeteer.waitForNavigation();
            // @ts-ignore
            await this.page.goto(url);

            await this.page.waitForSelector('.qhFLie > .FliLIb > .VfPpkd-dgl2Hf-ppHlrf-sM5MNb > .VfPpkd-LgbsSe > .VfPpkd-vQzf8d')
            await this.page.click('.qhFLie > .FliLIb > .VfPpkd-dgl2Hf-ppHlrf-sM5MNb > .VfPpkd-LgbsSe > .VfPpkd-vQzf8d')

            await this.page.waitForSelector('.BudEQ:nth-child(1) > .sSzDje > .enBDyd > .zJKIV > .SCWude > .t5nRo')
            await this.page.click('.BudEQ:nth-child(1) > .sSzDje > .enBDyd > .zJKIV > .SCWude > .t5nRo')

            await this.page.waitForSelector('.qhFLie > .FliLIb > .VfPpkd-dgl2Hf-ppHlrf-sM5MNb > .VfPpkd-LgbsSe > .VfPpkd-RLmnJb')
            await this.page.click('.qhFLie > .FliLIb > .VfPpkd-dgl2Hf-ppHlrf-sM5MNb > .VfPpkd-LgbsSe > .VfPpkd-RLmnJb')

            await this.page.waitForSelector('.qhFLie > .FliLIb > .VfPpkd-dgl2Hf-ppHlrf-sM5MNb > .VfPpkd-ksKsZd-mWPk3d-OWXEXe-Tv8l5d-lJfZMc > .VfPpkd-RLmnJb')
            await this.page.click('.qhFLie > .FliLIb > .VfPpkd-dgl2Hf-ppHlrf-sM5MNb > .VfPpkd-ksKsZd-mWPk3d-OWXEXe-Tv8l5d-lJfZMc > .VfPpkd-RLmnJb')

            await this.page.waitForSelector('.qhFLie > .FliLIb > .VfPpkd-dgl2Hf-ppHlrf-sM5MNb > .VfPpkd-LgbsSe > .VfPpkd-RLmnJb')
            await this.page.click('.qhFLie > .FliLIb > .VfPpkd-dgl2Hf-ppHlrf-sM5MNb > .VfPpkd-LgbsSe > .VfPpkd-RLmnJb')

            await navigationPromise

            if (successSign) {
                /** Save User **/
                const json = new Json(URL_JSON_FILE_YOUTUBE_ACCOUNTS);
                const user = json.read();
                user.list.push(account.toJSON())
                json.save(user);
            }
        }

        await sleep(20000);

        /**
         await page.waitForSelector('.qhFLie > #accountDetailsNext > .VfPpkd-dgl2Hf-ppHlrf-sM5MNb > .VfPpkd-LgbsSe > .VfPpkd-vQzf8d')
         await page.click('.qhFLie > #accountDetailsNext > .VfPpkd-dgl2Hf-ppHlrf-sM5MNb > .VfPpkd-LgbsSe > .VfPpkd-vQzf8d')

         await page.waitForSelector('.qhFLie > #accountDetailsNext > .VfPpkd-dgl2Hf-ppHlrf-sM5MNb > .VfPpkd-LgbsSe > .VfPpkd-RLmnJb')
         await page.click('.qhFLie > #accountDetailsNext > .VfPpkd-dgl2Hf-ppHlrf-sM5MNb > .VfPpkd-LgbsSe > .VfPpkd-RLmnJb')

         await page.waitForSelector('#selectioni1')
         await page.click('#selectioni1')

         await page.waitForSelector('.qhFLie > #accountDetailsNext > .VfPpkd-dgl2Hf-ppHlrf-sM5MNb > .VfPpkd-LgbsSe > .VfPpkd-vQzf8d')
         await page.click('.qhFLie > #accountDetailsNext > .VfPpkd-dgl2Hf-ppHlrf-sM5MNb > .VfPpkd-LgbsSe > .VfPpkd-vQzf8d')

         await page.waitForSelector('#day')
         await page.click('#day')

         await page.waitForSelector('#month')
         await page.click('#month')

         await page.select('#month', '6')

         await page.waitForSelector('#year')
         await page.click('#year')

         await page.waitForSelector('#gender')
         await page.click('#gender')

         await page.select('#gender', '1')
         await page.select('select[id="gender"]', account.gender);

         await page.focus('input[name="dateOfBirth"]');
         await page.keyboard.type(account.month, {delay: 50});
         await page.keyboard.type(account.day, {delay: 50});
         await page.keyboard.type(account.year, {delay: 50});
         await page.select('select[name="country"]', account.country);
        **/
    }
}
