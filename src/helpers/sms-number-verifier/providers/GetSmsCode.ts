import GetSMSCodeClient from 'getsmscode';
import parseMessage from 'parse-otp-message';
import Provider from './Provider';
import logger from '../../../utils/logger';
import { sleep } from '../../../utils';

export default class GetSMSCodeProvider extends Provider {
    _client: GetSMSCodeClient
    constructor (options = { }) {
        super()

        this._client = new GetSMSCodeClient(options)
    }

    get name () {
        return 'getsmscode'
    }

    async addNumberToBlacklist (options) {
        return this._client.addNumberToBlacklist(options)
    }

    async getNumbers (options) {
        const result = await this._client.getNumber(options)
        return [ result ]
    }

    async getMessages (options) {
        if (options && options.attempt === 0) {
            await sleep()
        }

        const text = (await this._client.getSMS(options)).trim()
        logger.info('GetSmsCode.getMessages', text)

        if (text === 'Message|not receive' || text === 'Message|Please wait 10 seconds to request!') {
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
