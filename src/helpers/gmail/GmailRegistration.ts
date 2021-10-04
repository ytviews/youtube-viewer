import { ElementHandle } from 'puppeteer';
import { isUndefined } from 'lodash';
import { BrowserPage, IPublicIp } from '../../interfaces';
import { BrowserContext } from '../../core/browser/BrowserContext';
import Account from "../../core/accounts/Account";
import SMSNumberVerifier from '../sms-number-verifier';
import { logger, sleep } from '../../utils';


export class GmailRegistration extends BrowserPage {
    accounts: Array<Account>;

    constructor(
        browser: BrowserContext,
        name: string,
        url: string = 'https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Dfr%26next%3D%252F&hl=fr&passive=false&service=youtube&uilel=0&flowName=GlifWebSignIn&flowEntry=AddSession',
        publicIp: IPublicIp,
        accounts: Array<Account>) {
        super(browser, name, url, publicIp);
        this.accounts = accounts
    }

    private async registerByPhone() {
        /** Getting Number and Verification Code **/
        let smsVerifier: SMSNumberVerifier = new SMSNumberVerifier('onlinesim', {
            token: '5543937fad3e4d186f3155e8f8f746f1',
            // @ts-ignore
            country: this.publicIp.country
        });
        let validNumber: boolean;
        let number;
        try {
            // fetch a number to use for a new verification request
            number = await smsVerifier.getNumber({ service: 'google' });
            logger.info(`Number Info: ${
                JSON.stringify(
                    smsVerifier.getNumberInfo(number.number),
                    null,
                    2)
            }`);
            await sleep(5);
        } catch (exception) {
            logger.info(exception)
        }

        /** Typing Number **/
        if (!isUndefined(number.number)) {
            await this.page.input('input[type="tel"]', number.number,{ delay: 70 }, true);
            await sleep(2);
            validNumber = await this.page.puppeteer.evaluate(() =>
                !document.querySelector('svg[class="stUf5b qpSchb"][aria-hidden="true"]')
            );
        }
        // @ts-ignore
        logger.warn(`Valid Number: ${validNumber}`);

        // @ts-ignore
        if (validNumber) {
            /** Verification Code **/
                // check for valid codes received via SMS from the google service
            const smsCode = await smsVerifier.getAuthCodes({ number, service: 'google' });
            logger.info(`Code SMS: ${smsCode}`);
            /** Fill Verification Code **/
            await this.page.waitForSelector('verifyCode');
            await this.page.input('verifyCode', smsCode[0], { delay: 100 }, true);
        }
    }

    private async fillName(account: Account): Promise<void> {
        await this.page.waitForSelector('firstName')
        await this.page.input('firstName', account.firstName, { delay: 100 });
        await this.page.input('lastName', account.lastName, { delay: 100 });
    }

    private async fillPassword(account: Account): Promise<void> {
        await this.page.input('password', account.password, { delay: 100 });
        await this.page.input('confirmPasswd', account.password, { delay: 100 });
    }

    private async fillRegistrationData(account: Account): Promise<void> {
        // Names
        await this.fillName(account)
        await sleep();

        // Email
        // @ts-ignore
        const clickCreateNewEmail: ElementHandle = await this.page.waitForSelector('clickCreateNewEmail')
        await clickCreateNewEmail.click();
        await this.page.input('username', account.username, { delay: 100 }, true)
        await this.page.waitForTimeout(1000)

        const usernameExist = await this.page.puppeteer.evaluate(() =>
            !!document.querySelector('#username[aria-invalid="true"]')
        );

        if (usernameExist) {
            logger.info('Email Exist. Please try again.');
            await this.page.click('username', { clickCount: 3 });

            // const string selAltEmail = "ul#usernameList li";
            // var elAltEmail = await page.QuerySelectorAsync(selAltEmail);
            // if (!(elAltEmail != null && await elAltEmail.IsIntersectingViewportAsync())) return false;

            await this.page.puppeteer.evaluate(() => {
                const buttons: NodeList = document.querySelectorAll('button[jsname="xqKM5b"]');
                // @ts-ignore
                buttons[Math.floor(Math.random() * buttons.length)].click();
            });
        }

        await sleep();
        // Password
        await this.fillPassword(account)

        // Wait for page to load
        await this.page.waitForTimeout(1000);

        // Click "Next"
        // @ts-ignore
        const accountDetailsNext: ElementHandle = await this.page.waitForSelector('accountDetailsNext');
        await accountDetailsNext.click();
    }

    public async processors() {

        await Promise.all(
            this.accounts.map(async (account: Account): Promise<void> => {
                const navigationPromise = this.page.puppeteer.waitForNavigation();
                await this.page.goto(this.url);

                await sleep(2);
                // Click "Create an account"
                // @ts-ignore
                const createAnAccount: ElementHandle = await this.page.waitForSelector('createAnAccount');
                await createAnAccount.click();

                // Click "For me"
                // @ts-ignore
                const clickForMe: ElementHandle = await this.page.waitForSelector('clickForMe');
                await clickForMe.click();

                await this.page.waitForNavigation();
                await this.fillRegistrationData(account);

                await sleep(10);

                // Check if form Submitted
                const phoneCheck = await this.page.puppeteer.evaluate(() =>
                    !!document.querySelector('#phoneNumberId')
                );
                const recoveryEmail = await this.page.puppeteer.evaluate(() =>
                    !!document.querySelector('input[type="email"][name="recoveryEmail"]')
                );

                if (!(phoneCheck && recoveryEmail)) {
                    await this.registerByPhone();
                }

                await sleep(3);
                await this.page.input('day', account.birthday.day, { delay: 100 });
                await this.page.select('month', account.birthday.month);
                await this.page.input('year', account.birthday.year, { delay: 100 })

                await this.page.select('#gender', '1')
                await this.page.select('select[id="gender"]', account.gender);

                await navigationPromise
            }));
    }
}
