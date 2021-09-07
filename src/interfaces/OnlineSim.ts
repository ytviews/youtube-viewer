type IStateOneType =
    |'repeat'
    | 'index'

export interface IOptions {
    token: string|null
    country?: string
    service?: string
    domain?: string
    lang?: string
    dev_id?: number|null
}

export interface INumberOptions {
    service: string
    country?: string
    reject?: Array<number>
    extension?: boolean
}

export interface ISMSOptions {
    tzid: number;
    number: string;
    service?: string;
    timeout?: number;
    not_end?: boolean;
    full_message?: boolean;
}

export interface IStateOneOptions {
    tzid: number;
    message_to_code?: number;
    msg_list?: number;
    form?: number;
    clean?: number;
    repeat?: IStateOneType;
}

export interface IStateOne {
    tzid: number;
    response: string;
    number: number;
    service: string;
    time: number;
    msg: any;
    extend: number;
    country: number;
}

export interface ITariffCountryOne {
    name: string;
    position: number;
    code: number;
    new: boolean;
    enabled: boolean;
    services: {[service: string]: {
            count: number;
            popular: boolean;
            price: number;
            id: string|number;
            service: string|number;
            slug: string|number;
        }}
}


export interface ICallbackType { (code: string|null): void }
