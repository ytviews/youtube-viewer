import pRetry from 'p-retry';
import PhoneNumber from 'awesome-phonenumber';

import Provider from './providers/Provider';
import { getProviderByName } from './Providers';

/**
 * Main entrypoint for verifying numbers via SMS OTP.
 *
 * @param {string|Provider} provider - Name of built-in provider or an instance
 * of a custom provider.
 * @param {object} [options={}] - Config options for provider
 */
export default class SMSNumberVerifier {
    _provider: Provider
    _timestamp: Date
    constructor (provider: string|Provider, options = { }) {
        this._provider = provider instanceof Provider
            ? provider
            : getProviderByName(provider, options)

        this._timestamp = new Date()
    }

    /**
     * Underlying OTP provider.
     *
     * @member {Provider}
     */
    get provider () { return this._provider }

    /**
     * @return {Promise<string>}
     */
    async getNumber (options = { }) {
        // @ts-ignore
        const { blacklist, whitelist, ...rest } = options
        // @ts-ignore
        let numbers: Array = await this._provider.getNumbers(rest)

        if (blacklist) {
            numbers = numbers.filter((number: any) => !blacklist.has(number))
        }

        if (whitelist) {
            numbers = numbers.filter((number: any) => whitelist.has(number))
        }

        return numbers[Math.floor(Math.random() * numbers.length)]
    }

    /**
     * @return {Promise<Array<string>>}
     */
    async getAuthCodes (options: any) {
        const {
            retries = 3,
            minTimeout = 5000,
            maxTimeout = 20000,
            timestamp = this._timestamp,
            number,
            service,
            ...rest
        } = options

        let attempt = 0
        return pRetry(async () => {
            // @ts-ignore
            const messages: Array = await this._provider.getMessages({ number, service, ...rest, attempt })

            const results = (messages || [])
                .filter((m: any) => m.service === service)
                .filter((m: any) => !timestamp || m.timestamp >= timestamp)
                .map((m: any) => m.code)

            if (!results.length) {
                ++attempt
                throw new Error(`waiting for SMS message for service \`${service}\` at number \`${number}\``)
            }

            return results
        }, {
            retries,
            minTimeout,
            maxTimeout
        })
    }

    /**
     * Parses the given number using google's libphonenumber.
     *
     * @param {string} number - Phone number to parse
     * @return {object}
     */
    getNumberInfo (number: string) {
        number = number.trim()

        if (!number.startsWith('+')) {
            number = `+${number}`
        }

        return new PhoneNumber(number)
    }
}

