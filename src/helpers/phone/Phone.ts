import axios from 'axios';
import { isEmpty } from 'lodash';
import { sleep } from '../../utils';
import { isProduction } from '../../utils/constants';

interface IReturn {
    tzid?: number
    number: string;
    full_number: string
    country: number
}

const MOCK_RESPONSE_MESSAGE = {"response":1,"countries":[{"country":7,"country_text":"Russia"},{"country":380,"country_text":"Ukraine"},{"country":77,"country_text":"Kazakhstan"},{"country":63,"country_text":"Philippines"},{"country":1,"country_text":"USA Virtual"},{"country":61,"country_text":"Australia"},{"country":358,"country_text":"Finland"},{"country":371,"country_text":"Latvia"},{"country":31,"country_text":"Netherlands"},{"country":34,"country_text":"Spain"},{"country":46,"country_text":"Sweden"},{"country":32,"country_text":"Belgium"},{"country":47,"country_text":"Norway"},{"country":351,"country_text":"Portugal"},{"country":40,"country_text":"Romania"},{"country":972,"country_text":"Israel"},{"country":372,"country_text":"Estonia"},{"country":33,"country_text":"France"},{"country":44,"country_text":"Britain"}],"numbers":{"752172852":{"country":33,"data_humans":"4 days ago","full_number":"+33752172852","is_archive":false}},"messages":{"current_page":1,"data":[{"text":"G-345148 Your Apple ID Code is: 345148. Don\\&#039;t share it with anyone. received from OnlineSIM.ru","in_number":"Apple","my_number":752172852,"created_at":"2021-08-23 20:16:08","data_humans":"1 minute ago"},{"text":"355883 is your Amazon OTP. Do not share it with anyone. received from OnlineSIM.ru","in_number":"Amazon","my_number":752172852,"created_at":"2021-08-23 20:15:49","data_humans":"1 minute ago"},{"text":"Your Apple ID Code is: 272182. Don\\&#039;t share it with anyone. received from OnlineSIM.ru","in_number":"Apple","my_number":752172852,"created_at":"2021-08-23 20:14:43","data_humans":"3 minutes ago"},{"text":"355883 is your Amazon OTP. Do not share it with anyone. received from OnlineSIM.ru","in_number":"Amazon","my_number":752172852,"created_at":"2021-08-23 20:14:22","data_humans":"3 minutes ago"},{"text":"Dein Uber Code: 6083. Antworte 38696 mit STOP, um keine Nachrichten mehr zu erhalten. received from OnlineSIM.ru","in_number":"38696","my_number":752172852,"created_at":"2021-08-23 20:13:31","data_humans":"4 minutes ago"},{"text":"355883 is your Amazon OTP. Do not share it with anyone. received from OnlineSIM.ru","in_number":"Amazon","my_number":752172852,"created_at":"2021-08-23 20:13:25","data_humans":"4 minutes ago"},{"text":"Your Opinion Outpost verification code is: 453347 received from OnlineSIM.ru","in_number":"AUTHMSG","my_number":752172852,"created_at":"2021-08-23 20:13:15","data_humans":"4 minutes ago"},{"text":"[Binance] Verification code: 760473. To prevent phishing, make sure that you\\&#039;re on our official website www.binance.com before proceeding. received from OnlineSIM.ru","in_number":"Binance","my_number":752172852,"created_at":"2021-08-23 20:11:37","data_humans":"6 minutes ago"},{"text":"672253 is your Amazon OTP. Do not share it with anyone. received from OnlineSIM.ru","in_number":"Amazon","my_number":752172852,"created_at":"2021-08-23 20:11:27","data_humans":"6 minutes ago"},{"text":"441663 is your Amazon OTP. Do not share it with anyone. received from OnlineSIM.ru","in_number":"Amazon","my_number":752172852,"created_at":"2021-08-23 20:09:04","data_humans":"8 minutes ago"}],"first_page_url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=1","from":1,"last_page":231,"last_page_url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=231","links":[{"url":null,"label":"&laquo; Back","active":false},{"url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=1","label":"1","active":true},{"url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=2","label":"2","active":false},{"url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=3","label":"3","active":false},{"url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=4","label":"4","active":false},{"url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=5","label":"5","active":false},{"url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=6","label":"6","active":false},{"url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=7","label":"7","active":false},{"url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=8","label":"8","active":false},{"url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=9","label":"9","active":false},{"url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=10","label":"10","active":false},{"url":null,"label":"...","active":false},{"url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=230","label":"230","active":false},{"url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=231","label":"231","active":false},{"url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=2","label":"Forward &raquo;","active":false}],"next_page_url":"http:\/\/onlinesim.ru\/api\/getFreeList?page=2","path":"http:\/\/onlinesim.ru\/api\/getFreeList","per_page":10,"prev_page_url":null,"to":10,"total":2305,"number":"752172852","country":33},"ignore":"<p><b>Number, that you receive should not used for any illegal actions. It's forbidden to use phone numbers for sites, that have high-risk status, including: payments systems, banks and credit organizations.<\/b><\/p><p>Service does not receive messages from the following senders:<\/p><p> kyivstar, kaspi gold, payps, right-zaim, payeer.com, creditkinsu, credit-help, big-zaim.ru, eurogroshi, yandexmoney, qiwiinfo, openbroker, sms.kaz@, smartmoney, fortebank, groshivsim, rencredit, wurussia, binbankcard, kviku, cashberry, vakifbank, sportbank, webbankir, fin4go, trans kod, megafon, gigalifeapp, otkritie, fin2fin@, psb, pimpay, alfabank, ddmoney.ru, epa, rubli.ru, cryptowallet, rncb, sberid, vivid money, halykbank, frisbi24, shv.groshi, paysend, wirex, bankvtb@, anc, kto zvonil, zaymigo@, centrofin, kupinekopi, bestzaimo.ru, megafontv, vkpay, 900, tbankrot, creditnice., boomaney.ru, proplati, walletone, pochtabank, concordbank, bkapmahe, finmoll@, nakredit, alfa, dit_moslog, phonecode, vostbank.ru, papaya, 4slovo.ru, kredit-3000, [money2dayru], zaimco, kreditcentr, wmcheck, kazinfo, beeline@, mos.com.ru, el-plat.ru, finspin, tinkoff, tcktswallet, bystro-zaim, clubzaim.ru, pozyka, yoomoney, lovizaim, monzo, creditkasa, qppiru, cashdrive, 1clickmoney, prem-zaimru, paysafecard, cash4brands.ru, cashinsky, interkassa, bank.ipb, bistrodengi, bankovo.ru, Kyivstar, miloan.ua, mastercard, unicom24ru, privatbank, fingo, 3339, bankffin, wm mini, pumb, raiffeisen, moneza, go2bank, moneyqlo.ru, zaim, lime-zaim, dengas.ru, moneyextra, mchs, webmoney.ua, moneysend, vivus.ru, creditstar, boomaney.ru , mrmoney@, unicom24, activebc, kaspi pay, kredit, gotivo4ka, credit7.ru, zaimm24.ru, wallet one, mili.ru, dengisrazu, moonpay@, atzaim.ru, vm-homecr, swizo, slot78, creditter, mzaim24.ru, wu russia, givemoney, novikredyty, cashmo, proleads, vivadengi, bankdki, neocredit, yota, centrzaim, wmmini, my beeline, rubliner.ru, unicredit, rosbank, microcash, BeelineClub, megafon@, creditport, paysera@, much money, zaymigo.com, mtc, mtc.gid@, paymaya@, rocketbank, credit-pro, visa, monese, good-zaimru, smartiway, zaimy.rf, rublimo.ru, belkacredit, 99deneg.ru, cashtoyouru, odobrim.ru, zaem48.ru, vodafone, onefinrucom, touch bank, banknote, advcash, krplusso.ru, vivus, mikrozaym, vimpay, denga34.ru, vtb, zaimm365.ru, keny.cc, gpay, gosuslugi, tw team, payqr, migcredit, ckasa, beeinfo, aviracredit, paycenter, \u044e\u043d\u0438\u0441\u0442\u0440\u0438\u043c, bp-ipaytm, monebo, whoosh, payoneer, touch_bank, pay-zaim.ru, megafon_web, kachaigrosi, cash credit, 5151, 679, pancredit, microklad, goodcredit, creditka, sovest, pays.de, sms2money, moneygo@, erubli.ru, zaimer.kz, credit25000, ezaem, max.credit, fastmoney, telepay, portmone, sloncredit, crediton, credit, monexy, leupay, mywallet, starkredit, otp bank, ja-jiopay, 111, rubasy.ru, creditplus, robmoney.ru, dengga, paygoo, bp-paytmb, arbuzo, creditseven, dukascopy, loanklik, bankpekaosa, expresdengi, z_korona, mts.dengi, platizaru, fedorosu, swedbank, skb-bank, mts-bank, mchsrt, rnko_card, smartcredit, beeline, paysend.com, ckassa.ru, liqpay, mc_bbonus, safebank.ru, dit_emp@, getzaim24ru, web-zaim.ru, sovcombank, izibank, joompay, cash-1.ru, 4915730302462, koronapay, creditnice, tobizaim, robotmoney, monezp.ru, kaspi bank, wooppay.com, vm-pnbacs, gratapay, jysan bank, ferratum, 9138, indosat@, platiza.ru, gammamedia, rsb.ru, gotivka, cr911.ru, creditax.ru, planetacash, jk-jiopay, mos.ru, vzaimy24ru, cash22.ru, swip.one, resobank, globalmoney, greenmoney, platiza, denga, kf.ua, zaimika, qiwiwallet, ad-kblbnk, sbankers, soscredit, joymoney, homebank, 37128914187, zaimol.ru, zaim_online, creditronic, cash-u.com, skycash, mnedenga.ru, my-credit, 0500, banktochka, likecentre, shvgroshi, mccquattro, money4you, usovromv, spishi.vip, touchbank, zaimy24_7ru, smsfinance, sfurf.ru, my_creditua, etzaimo.ru, slimpay, tengeda.kz], na kartu, dinero, way for pay, dcredit, magnitpay, credinf24ru, qiwi_wallet, telemaster, easypay, icard, ruszaim24, rshb, moneyboom, monobank, mtinkoff, platipotom, dobrokredi, teremzaim, moneyveo, uplata, web setting, ubank, paypal, wm check, modulbank, unistream, finmarket, zaimall24ru, topcredit, gcash, inbank, rublikom.ru, tendopay, bistrodenga.ru, investrum, mtspodpiski, mzaim365.ru, turbozaim, cashni.ru, zamzam, alizaim, notify_kz, spasibo, privatbank24, credit7, banksoyuz, denegna.ru, spoko, mecred.ru, helpkredit, dengimy.ru, cardsmobile, rubliru.ru, zaymer.ru, 43676800325055, ecopayz, mycreditua, gazprombank, paysenger, glavfinans, kredit-24, elecsnet, lycamobile, ukredit, fns_russia, paycam, zaimexpress, manivam.ru, ripplebank, turbomoney, forzacredit, wmru, moneyyourgo, oschadbank, 878, ruszaim24ru, qiwi, finanso_kz, globalcredi, centrzaimov, moneyhy.ru, kaspikredit, denvzaimy, muchbetter, kaspi.kz, kreditker, dozarplati, gofingo, paylaterph, stripe, webmoney, debetkredit, cash-u, veomini@, mmoney24.ru, expobank, alfa-bank, citibank, oncredit, mts.invest, ideabank, qppi.ru, metrokredit, dit_dogm, cash app, [mywallet], n26, homecredit, bank_dom.rf, ffcredit, mangomoney, finam, papazaim, zecredit, pscb, kredizka.ru, vipzaym, ezaem.ru, a-business, whoosh.bike, bankasi, mycredit, alexcredit, cardcompact, sbrf, e-cash, needzaim.ru, paysending, sgroshi7, vitrinmoney, kredito24, 1020, unocreditru, 1711, mobi.dengi, moneyman, rnko card, gurucash, eurozaem, apollonzaym, finansbyrg, kerimov@, ekapusta, paynamics, vloan, loanklik.ru, ukrgasbank, megafonpro, todobank, tele2, creditman, cimb_bank, banki.ru, ccloan, transferwise, qiwi wallet, skrill, home_credit, sharpay, kit_notify, websetting<\/p>"}
const MOCK_RESPONSE_PHONE = {"response":"1","numbers":[{"number":"752172852","country":33,"updated_at":"2021-08-23 19:32:24","data_humans":"4 \u0434\u043d\u044f \u043d\u0430\u0437\u0430\u0434","full_number":"+33752172852","country_text":"\u0424\u0440\u0430\u043d\u0446\u0438\u044f","maxdate":"2021-08-19 13:23:24","status":"disabled"}]}

export default class Phone {
    // public static apiKey: string = '7ac0d7f083325b8e487b136fe06d59af'
    public static apiKey: string = '5543937fad3e4d186f3155e8f8f746f1'
    public static country: number = 33

    public static async Number(): Promise<IReturn> {
        try {
            let returnVal: IReturn = {
                tzid: 0,
                number: '',
                full_number: '',
                country: 0,
            };
            // 33 - France
            // 1000 - Canada
            // const URL_ONLINE_SIM = isProduction ? `https://onlinesim.ru/api/getNum.php?apikey=${Phone.apiKey}&country=${Phone.country}&service=Google&number=true` : `https://onlinesim.ru/api/getFreePhoneList?country=${Phone.country}`;
            const URL_ONLINE_SIM = `https://onlinesim.ru/api/getNum.php?apikey=${Phone.apiKey}&country=${Phone.country}&service=Google&number=true`;

            const { data } = await axios.get(URL_ONLINE_SIM, {
                timeout: 5000,
                // @ts-ignore
                async: true,
                crossDomain: true,
                headers: {"accept": "application/json"},
            })
            const { numbers, tzid, number } = data;
            if (!isEmpty(numbers)) {
                returnVal = {
                    number: data.numbers[0].number,
                    full_number: data.numbers[0].full_number,
                    country: data.numbers[0].country
                }
            } else {
                returnVal = {
                    tzid,
                    number,
                    full_number: number,
                    country: Phone.country
                }
            }

            return returnVal
        } catch (error) {
            console.log('Number Error: ', error);
        }
    }

    public static async SmsCode(numberInfo: IReturn): Promise<string> {
        try {
            let smsCode = '';
            // const URL_ONLINE_SIM = isProduction ? `https://onlinesim.ru/api/getState.php?apikey=${Phone.apiKey}&tzid=${numberInfo.tzid}&message_to_code=1&form=1&msg_list=0` : `https://onlinesim.ru/api/getFreeList?lang=en&country=${numberInfo.country}&page=1&number=${numberInfo.number}&subkey=${Phone.apiKey}`
            const URL_ONLINE_SIM = `https://onlinesim.ru/api/getState.php?apikey=${Phone.apiKey}&tzid=${numberInfo.tzid}&message_to_code=1&form=1&msg_list=0`;

            do {
                const { data } = await axios.get(URL_ONLINE_SIM, {
                    // timeout: 5000,
                    // @ts-ignore
                    async: true,
                    crossDomain: true,
                    headers: {"accept": "application/json"},
                })

                if (!isEmpty(data.messages)) {
                    const { messages: { data: messages }} = data
                    const message = messages[0];
                    smsCode = message.text.match(/^G-?\d+/ig).join('');
                    break;
                }
                if (!isEmpty(data[0].msg)) {
                    const { msg: messages } = data[0]
                    smsCode = messages;
                    break;
                }
                await sleep(2);
            } while (smsCode == '')

            return smsCode;
        } catch (error) {
            console.log('SmsCode Error: ', error);
        }
    }
}
