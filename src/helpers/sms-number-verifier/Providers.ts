export const providers = {
    plivo: require('./providers/Plivo'),
    getsmscode: require('./providers/GetSmsCode'),
    smsreceivefree: require('./providers/SmsReceiveFree'),
    onlinesim: require('./providers/OnlineSim'),
}

export const getProviderByName = (provider: string, options) => {
    const { default: Provider } = providers[provider.toLowerCase()]

    if (!Provider) throw new Error(`unrecognized provider "${provider}"`)
    return new Provider(options)
}
