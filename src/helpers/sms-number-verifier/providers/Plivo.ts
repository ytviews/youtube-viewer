// @ts-ignore
import parseMessage from 'parse-otp-message';
import { Client } from 'plivo';
import pEvent from 'p-event';

import IncomingSMSServer from './incoming-sms-server';
import Provider from './provider';
import { IMessage } from '../../../interfaces';

interface IPlivoProvider {
    authId: string;
    authToken: string;
}

interface IOptionsMessages {
    timeout: number
    number: number
    service: string
}

export default class PlivoProvider extends Provider {
    _server: IncomingSMSServer
    _client: Client
    _messages: {[key: string]: IMessage}
    // @ts-ignore
    _initialized: boolean
    constructor (options: IPlivoProvider) {
        super()

        const authId: string|undefined = options.authId || process.env.PLIVO_AUTH_ID
        const authToken: string|undefined = options.authToken || process.env.PLIVO_AUTH_TOKEN

        this._messages = { }

        this._client = new Client(authId, authToken)
        this._server = new IncomingSMSServer({
            transform: (body: any) => {
                const message: IMessage = {
                    from: body.From,
                    to: body.To,
                    text: body.Text,
                    id: body.MessageUUID,
                    timestamp: new Date()
                }

                const result = parseMessage(message.text)
                if (result && result.code && result.service) {
                    message.code = result.code
                    message.service = result.service
                    return message
                }
            }
        })

        this._server.on('message', (message) => {
            if (!this._messages[message.to]) {
                // @ts-ignore
                this._messages[message.to] = []
            }

            // TODO: limit max number of messages stored in memory
            // @ts-ignore
            this._messages[message.to].push(message)
        })
    }

    get name () {
        return 'plivo'
    }

    async getNumbers (options = { }) {
        // @ts-ignore
        const { limit = 20, offset = 0 } = options

        await this._ensureInitialized()

        const results = await this._client.numbers.list({
            limit: Math.max(1, Math.min(20, limit)),
            offset: Math.max(0, offset),
            services: 'sms'
        })

        return results
            .map((o: any) => o.number)
    }

    // @ts-ignore
    async getMessages (options: IOptionsMessages): Promise<IMessage[]> {
        const {
            timeout = 60000,
            number,
            service
        } = options
        // @ts-ignore
        ow(number, ow.string.nonEmpty.label('number'))
        // @ts-ignore
        ow(service, ow.string.nonEmpty.label('service'))

        await this._ensureInitialized()
        // @ts-ignore
        if (this._messages[number]) {
            // @ts-ignore
            return this._messages[number].reverse().slice(0, 3)
        }

        await pEvent(this._server, 'message', {
            timeout,
            filter: (message) => {
                return (message.to === number && message.service === service)
            }
        })
        // @ts-ignore
        return this._messages[number].reverse().slice(0, 3)
    }

    async _ensureInitialized () {
        if (this._initialized) return
        // @ts-ignore
        const apps: any[] = await this._client.applications.list()
        const app = apps.filter((app) => app.defaultApp)[0]

        if (!app) {
            throw new Error('unable to find default plivo app')
        }

        await this._server.listen()

        await this._client.applications.update(app.id, {
            // @ts-ignore
            message_url: this._server.url,
            message_method: this._server.method
        })

        this._initialized = true
    }

    async close () {
        if (!this._initialized) return

        await this._server.close()
        this._initialized = false
    }
}
