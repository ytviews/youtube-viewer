
export class BrowserSettings extends IChromiumSettings {

    private static Log: ILog = LogManager.GetLogger(typeof(ChromiumSettings));

    private _chromiumPath: string;

    private _userAgentProvider: IUserAgentProvider;

    private _proxyStore: IProxyStore;

    private userAgent: string = ConfigurationManager.AppSettings[nameof(userAgent)];

    private Headless: boolean;

    private _noProxy: boolean;

    private _addedArgs: List<string> = new List<string>();

    public get Proxy(): string {
    }
    public set Proxy(value: string)  {
    }

    public get ServiceCode(): ServiceCode {
    }
    public set ServiceCode(value: ServiceCode)  {
    }

    public constructor (chromiumPath: string, userAgentGenerator: IUserAgentProvider, proxyStore: IProxyStore) {
        this._chromiumPath = chromiumPath;
        this._userAgentProvider = userAgentGenerator;
        this._proxyStore = proxyStore;
        let .: boolean;
        TryParse(ConfigurationManager.AppSettings[nameof(this.Headless)], /* out */this.Headless);
    }

    public GetHeadless(): boolean {
        return this.Headless;
    }

    public GetPath(): string {
        return this._chromiumPath;
    }

    public GetUserAgent(): string {
        if ((string.IsNullOrEmpty(this.userAgent)
            && (this._userAgentProvider != null))) {
            let randomUserAgent = this._userAgentProvider.GetRandomUserAgent(this.ServiceCode);
            return randomUserAgent;
        }

        return this.userAgent;
    }

    public GetArgs(): IEnumerable<string> {
        // ?@>:A8
        let args: List<string> = new List<string>();
        if (!string.IsNullOrEmpty(this.Proxy)) {
            Log.Debug("{nameof(Proxy)}: {Proxy}");
            let proxy = string.Empty;
            let idxComma = this.Proxy.IndexOf(',');
            let proxyProtocol = string.Empty;
            if ((idxComma >= 0)) {
                proxy = this.Proxy.Substring(0, idxComma);
                proxyProtocol = this.Proxy.Substring((idxComma + 1)).Trim().ToLower();
                if (proxyProtocol.StartsWith("socks")) {
                    proxyProtocol = "{proxyProtocol}://";
                }
                else {
                    proxyProtocol = string.Empty;
                }

            }

            if (proxy.Contains("@")) {
                proxy = proxy.Split('@')[1];
            }

            args.Add("--proxy-server={proxyProtocol}{proxy}");
        }

        if ((this._userAgentProvider != null)) {
            let useragent = this.GetUserAgent();
            if (!string.IsNullOrEmpty(useragent)) {
                Log.Debug("{nameof(useragent)}: {useragent}");
                args.Add("--user-agent=""""{useragent}""""");
            }

        }

        if (this._noProxy) {
            args.Add("--no-proxy-server");
        }

        args.AddRange(this._addedArgs);
        return args;
    }

    public GetProxy(serviceCode: ServiceCode): string {
        return this._proxyStore.GetProxy(serviceCode);
        // TODO: Warning!!!, inline IF is not supported ?
        (this._proxyStore != null);
        let .: string;
        Empty;
    }

    public MarkProxySuccess(serviceCode: ServiceCode, proxy: string) {
        if ((this._proxyStore != null)) {
            this._proxyStore.MarkProxySuccess(serviceCode, proxy);
        }

    }

    public MarkProxyFail(serviceCode: ServiceCode, proxy: string) {
        if ((this._proxyStore != null)) {
            this._proxyStore.MarkProxyFail(serviceCode, proxy);
        }

    }

    public AddArg(arg: string) {
        this._addedArgs.Add(arg);
    }

    public ClearArgs() {
        this._addedArgs.Clear();
    }
}
