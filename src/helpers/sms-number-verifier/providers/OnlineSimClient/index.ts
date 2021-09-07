import { delay, logger } from '../../../../utils';
import { countryCodes } from './projects';
import {
    IStateOne,
    ISMSOptions,
    ICallbackType,
    INumberOptions,
    IStateOneOptions,
    ITariffCountryOne,
} from '../../../../interfaces/OnlineSim';
import _BaseRequest from '../_Base';

// https://github.com/s00d/onlinesim-js-api/blob/master/src/Apis/GetNumbers.ts
// https://github.com/pasevin/node-onlinesim-api/blob/master/index.js
// https://github.com/dialogflower/df2/blob/master/server.es6
// https://github.com/unger1984/tgspam
/**
 * @class OnlineSimClient
 *
 * @param {object} [options] - Config options
 * @param {string} [options.token=process.env.ONLINESIM_TOKEN] - Token for onlinesim auth
 * @param {number} [options.country=33] - Country for this client to use (7/33/01)
 * @param {string} [options.domain='getNum'] - Domain for this client to use (getServiceList/getNum/getState)
 */
export default class OnlineSimClient extends _BaseRequest {

    /**
     *
     * @param {string} service
     * @param {number} country
     * @return {Promise<string>}
     */
    async price(service: string, country = 7): Promise<string> {
        return this._request('getPrice', {service, country}).then((resp) => resp.price);
    }

    async getServiceList() {
        return await this._request('getService')
    }

    /**
     *
     * @param {INumberOptions} options
     */
    async getNumberOnlyTZid(options: INumberOptions): Promise<number> {
        let {
            service,
            country = 'france',
            reject = [],
            extension = false
        } = options

        if (country) country = country.toLowerCase();
        if (!this._country && !country) throw new Error('country required')
        if (!this._service && !service) throw new Error('service required')
        if (country && !countryCodes.has(country)) throw new Error(`invalid country "${country}"`)
        if (country) this._country = countryCodes.get(country)

        const response = await this._request('getNum', {
            service,
            country: this._country,
            reject, extension
        });
        return response.tzid
    }

    /**
     * Acquires a temporary handle on a mobile number usable for the given service.
     * You must specify either `options.service`
     *
     * @param {INumberOptions} options - Config options
     * @param {string} [options.service] - Name of service to number
     * @param {string} [options.country] - Country code (required)
     * @return {Promise}
     */
    async getNumber (options: INumberOptions): Promise<{tzid: number, number: string, country: number}> {
        let {
            service,
            country,
            reject = [],
            extension = true
        } = options

        if (country) country = country.toLowerCase();
        if (!this._country && !country) throw new Error('country required')
        if (!this._service && !service) throw new Error('service required')
        if (country && !countryCodes.has(country)) throw new Error(`invalid country "${country}"`)
        if (country) this._country = countryCodes.get(country)

        const response = await this._request('getNumber', {
            service: service || this._service,
            country: this._country,
            reject,
            number: true
        }, extension);
        logger.info(JSON.stringify(response));

        return {
            tzid: response.tzid,
            number: response.number,
            country: this._country
        }
    }

    /**
     *
     * @param {number} message_to_code
     * @param {string} orderby
     * @param {boolean} msg_list
     * @param {boolean} clean
     * @param {boolean} repeat
     * @return {Promise<Array<IStateOne>>}
     */
    async status(
        message_to_code = 1,
        orderby:'ASC'|'DESC' = 'ASC',
        msg_list = true,
        clean = true,
        repeat = false): Promise<Array<IStateOne>> {
        return this._request('getStatus', {
            message_to_code,
            orderby,
            msg_list: msg_list ? 1:0,
            clean: clean ? 1:0,
            type: repeat ? 'repeat':'index'
        }).then((resp) => resp)
    }

    /**
     *
     * @param {IStateOneOptions} options
     * @return {Promise<IStateOne>}
     */
    statusOne(options: IStateOneOptions): Promise<IStateOne> {
        return this._request('getStatus', options).then((resp) => resp[0])
    }

    /**
     *
     * @param {number} tzid
     * @return {Promise<boolean>}
     */
    next(tzid: number): Promise<boolean> {
        return this._request('setOperationRevise', { tzid }).then((response) => {
            console.log(response)
            return true
        })
    }

    /**
     *
     * @param {number} tzid
     * @return {Promise<boolean>}
     */
    close(tzid: number): Promise<boolean> {
        return this._request('setOperationOk', {tzid}).then((response) => {
            console.log(response)
            return true
        })
    }

    /**
     *
     * @param {number} tzid
     * @return {Promise<boolean>}
     */
    ban(tzid: number): Promise<boolean> {
        return this._request('setOperationOk', {tzid, ban: 1}).then((response) => {
            console.log(response)
            return true
        })
    }

    /**
     *
     * @param {string} service
     * @param {number} number
     * @return {Promise<number>}
     */
    repeat(service: string, number: number): Promise<number> {
        return this._request('getNumRepeat', {service, number}).then((response) => response.tzid)
    }

    /**
     * @return {Promise<{[country: string]: ITariffCountryOne }>}
     */
    tariffs(): Promise<{[country: string]: ITariffCountryOne }> {
        return this._request('getNumbersStats', {country: 'all'}).then((response) => response)
    }

    /**
     *
     * @param {number} country
     * @return {Promise<ITariffCountryOne>}
     */
    tariffsOne(country: number = 7): Promise<ITariffCountryOne> {
        return this._request('getNumbersStats', {country}).then((response) => response)
    }

    /**
     * @return {Promise<Array<string>>}
     */
    service(): Promise<Array<string>> {
        return this._request('getService', {}).then((response) => response.service)
    }

    /**
     *
     * @param {string} service
     * @return {Promise<Array<string>>}
     */
    serviceNumber(service: string): Promise<Array<string>> {
        return this._request('getServiceNumber', {service}).then((response) => response.number)
    }

    /**
     *
     * You must specify either `options.tzid`.
     *
     * @param {ISMSOptions} options - Config options
     * @param {string} options.number - Number
     * @param {string} [options.tzid] - Identifier of operation
     * @param {function} callback - Callback function
     * @return {Promise<string>}
     */
    async getSMS (options: ISMSOptions, callback: null|ICallbackType = null): Promise<string> {
        const {
            tzid,
            timeout = 10,
            not_end = false,
            full_message = false
        } = options;
        let __last_code: string = '';
        let _response_type: number = 1;
        let status = null;
        let counter = 0;

        if (full_message) _response_type = 0;

        while (status != 'TZ_NUM_ANSWER' && status != 'ERROR_NO_OPERATIONS') {
            await delay(timeout);
            counter += 1
            if (counter >= 10) {
                throw new Error('Timeout error')
            }
            const response = await this.statusOne({
                tzid,
                message_to_code: _response_type,
                form: 1,
                msg_list: 0
            });

            if ('msg' in response && !not_end && response['msg'] != __last_code) {
                __last_code = response['msg']
                await this.close(tzid)
                break;
            } else if('msg' in response && not_end && response['msg'] != __last_code) {
                __last_code = response['msg']
                await this.next(tzid)
                break
            }

            status = response.response
            logger.info('Waiting for SMS code', status)
        }

        if (callback) {
            callback(__last_code)
        }
        return __last_code
    }
}
