import SMSNumberVerifier from '../src/helpers/sms-number-verifier'


async function mainVerifier() {
    const smsVerifier = new SMSNumberVerifier('onlinesim', {
        token: '5543937fad3e4d186f3155e8f8f746f1',
        country: 'France'
    })

// fetch a number to use for a new verification request
    const number = await smsVerifier.getNumber({ service: 'google' })

// give number to third-party service such as google...
// third-party service sends SMS code to the given number

// check for valid codes received via SMS from the google service
    const codes = await smsVerifier.getAuthCodes({ number, service: 'google' })
    console.log(codes)
// codes = [ '584125' ]
}

mainVerifier()
