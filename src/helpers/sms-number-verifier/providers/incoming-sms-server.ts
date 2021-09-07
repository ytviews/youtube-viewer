'use strict'

import Koa from 'koa'
import Router from 'koa-router';
import { EventEmitter } from 'events';
import ngrok from 'ngrok';
import parse from 'co-body';
import pify from 'pify';

const noop = (m) => m
const route = '/1/messages'

export default class IncomingSMSServer extends EventEmitter {
    _port: number
    _app: Koa
    _router: Router
    method: string
    uri: string
    url: string

    constructor (options) {
        super()
        const {
            port = process.env.PORT || 11849,
            transform = noop
        } = options

        this._port = port
        this._app = new Koa()
        this._router = new Router()

        this._router.post(route, async (ctx) => {
            const body = await parse(ctx)
            const message = transform(body)

            ctx.status = 200
            ctx.body = ''

            if (message) {
                this.emit('message', message)
            }
        })

        this._app.use(this._router.routes())
    }

    async listen () {
        this._app.listen(this._port)
        this.uri = await ngrok.connect(this._port)
        this.url = `${this.uri}${route}`
        this.method = 'POST'
    }

    async close () {
        await ngrok.disconnect()
        await pify(this._app.close)()
    }
}
