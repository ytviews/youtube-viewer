import parseMessage from 'parse-otp-message';
import Provider from './Provider';
import OnlineSimClient, { IOptions } from './OnlineSimClient';
import { logger } from '../../../utils';

interface IReturn {
    tzid?: number
    number: string;
    full_number: string
    country: number
}

// https://github.com/transitive-bullshit/puppeteer-email/tree/master
// https://github.com/dragoroff/official/tree/master/Projects/gunshot-client
// https://github.com/rahuljoshua77/Automation-GMail-Registration-Account

export default class OnlineSimProvider extends Provider {
    _client: OnlineSimClient

    constructor (options: IOptions) {
        super()
        // @ts-ignore
        this._client = new OnlineSimClient(options)
    }

    get name(): string | Error {
        return 'onlinesim';
    }

    async getNumbers (options) {
        const result = await this._client.getNumber(options)
        return [ result ]
    }

    public async getMessages(options: IReturn) {
        const text = (await this._client.getSMS(options)).trim()
        logger.info('OnlineSim.getMessages', text)

        if (text === '') {
            return
        }

        if (text) {
            const result = parseMessage(text)
            logger.info('GetSmsCode.getMessages', result)

            if (result && result.code && result.service) {
                return [
                    {
                        ...result,
                        to: options.number,
                        text,
                        timestamp: new Date()
                    }
                ]
            }
        }
    }
}
