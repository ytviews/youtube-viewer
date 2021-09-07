import * as request from 'request-promise-native';
import {
    NoNumberException,
    RequestException
} from '../../../exceptions/GetPhoneNumberError';
import { IOptions } from '../../../interfaces/OnlineSim';
import { countryCodes } from './OnlineSimClient/projects';

export interface Response {
    response: number|string
    [key: string]: any
    [key: number]: any
}

const domainToSuffix = {
    getServiceList: 'getServiceList',
    getNumber: 'getNum',
    getStatus: 'getState',
    getService: 'getService',
    getOperations: 'getOperations',
    setOperationOk: 'setOperationOk',
    getBalance: 'getBalance',
}

export default class _BaseRequest {
    protected _url: string;
    protected _token: string|null;
    protected _country: number;
    protected _service: string;
    private _dev_id: number|null;
    private _lang: string;
    private _headers: {[key: string]: string } = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'
    }

    constructor (options: IOptions) {
        let {
            token = process.env.ONLINESIM_TOKEN,
            country = 'france',
            service,
            dev_id,
            lang
        } = options

        this._dev_id = dev_id
        this._lang = lang

        country = country.toLowerCase()
        if (country) {
            if (!countryCodes.has(country)) throw new Error(`invalid code country "${country}"`)
            this._country = countryCodes.get(country)
        }
        this._service = service
        this._token = token
        if(token) {
            this._headers['Authorization'] = 'Bearer ' +  token
        }
        this._url = 'https://onlinesim.ru/api/'
    }

    protected async _request (uri: string, params: {[key: string]: any } = { }, extension = true) {
        const suffix = domainToSuffix[uri];
        if (!suffix) throw new Error(`unknown OnlineSim Uri "${uri}"`);
        const baseUrl: string = `${this._url}${suffix}`;
        let ssuffix = extension ? '.php' : '';
        const sUrl: string = `${baseUrl}${ssuffix}`;

        params.lang = this._lang;
        if(this._dev_id) {
            params.dev_id = this._dev_id
        }

        const qs = {
            apikey: this._token,
            ...params
        }

        if (this._country) {
            // @ts-ignore
            qs.country = qs.country || this._country
        }

        console.log('GET', sUrl, JSON.stringify(qs, null, 2))

        return request.get({
            url: sUrl,
            qs,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'
            },
            json: true
        }).then((response: Response) => {
            if('response' in response && response.response.toString() !== '1') {
                if(response.response.toString() === 'NO_NUMBER' ||response.response.toString() === 'NO_NUMBER_FOR_FORWARD') {
                    throw new NoNumberException(response.response.toString());
                }
                throw new RequestException(response.response.toString());
            }

            delete response.response
            return response
        })
    }

    protected async _postRequest(url: string,  params: {[key: string]: any } = {}) {
        const sUrl: string = `${url}.php`;
        if(this._dev_id) {
            params.dev_id = this._dev_id
        }
        const qs = {
            apikey: this._token,
            lang: this._lang,
            ...params
        }
        return request.post({
            url: sUrl,
            qs,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'
            },
            json: true
        }).then((response: Response) => {
            if('response' in response && response.response.toString() !== '1') {
                if(response.response.toString() === 'NO_NUMBER' ||response.response.toString() === 'NO_NUMBER_FOR_FORWARD') {
                    throw new NoNumberException(response.response.toString());
                }
                throw new RequestException(response.response.toString());
            }
            delete response.response
            return response
        })
    }
}
