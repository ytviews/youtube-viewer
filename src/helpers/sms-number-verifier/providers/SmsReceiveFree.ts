'use strict'

import cheerio from 'cheerio';
// @ts-ignore
import parseMessage from 'parse-otp-message';
// @ts-ignore
import parseTime from 'parsetime';
import request from './request';
import Provider from './Provider';
import { ISMSOptions, IMessage } from '../../../interfaces';

const baseUrl = 'https://smsreceivefree.com'

export default class SMSReceiveFreeProvider extends Provider {
    get name () {
        return 'smsreceivefree'
    }

    async getNumbers (options = { }) {
        // @ts-ignore
        const { country = 'usa' } = options

        const html = await request(`${baseUrl}/country/${country}`)
        const $ = cheerio.load(html)

        return $('a.numbutton')
            // @ts-ignore
            .map((i, a) => $(a).text())
            .get()
            .map((n) => {
                const match = n.match(/^\+(\d+)/)
                if (match) return match[1]
            })
            .filter(Boolean)
    }

    async getMessages (options: ISMSOptions): Promise<any> {
        const {
            number
        } = options

        const html = await request(`${baseUrl}/info/${number}/`)
        const $ = cheerio.load(html)

        // @ts-ignore
        return $('.msgTable tr')
            // @ts-ignore
            .map((i, el) => {
                const tds = $('td', $(el))
                    // @ts-ignore
                    .map((i, e) => $(e).text())
                    .get()

                if (tds.length === 3) {
                    const timeago = parseTime(tds[1].trim())
                    return {
                        from: tds[0].trim(),
                        timestamp: new Date(timeago.absolute),
                        text: tds[2].trim()
                    }
                }
            })
            .get()
            .filter(Boolean)
            // @ts-ignore
            .map((m: IMessage) => {
                const result = parseMessage(m.text)

                if (result && result.code && result.service) {
                    m.code = result.code
                    m.service = result.service
                    return m
                }
            })
            .filter(Boolean)
    }
}
