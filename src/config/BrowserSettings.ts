
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

    public get GetArgs(): string[] {
        const result = [
            '--allow-running-insecure-content', // https://source.chromium.org/search?q=lang:cpp+symbol:kAllowRunningInsecureContent&ss=chromium
            '--autoplay-policy=user-gesture-required', // https://source.chromium.org/search?q=lang:cpp+symbol:kAutoplayPolicy&ss=chromium
            '--disable-component-update', // https://source.chromium.org/search?q=lang:cpp+symbol:kDisableComponentUpdate&ss=chromium
            '--disable-domain-reliability', // https://source.chromium.org/search?q=lang:cpp+symbol:kDisableDomainReliability&ss=chromium
            '--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process', // https://source.chromium.org/search?q=file:content_features.cc&ss=chromium
            '--disable-print-preview', // https://source.chromium.org/search?q=lang:cpp+symbol:kDisablePrintPreview&ss=chromium
            '--disable-setuid-sandbox', // https://source.chromium.org/search?q=lang:cpp+symbol:kDisableSetuidSandbox&ss=chromium
            '--disable-site-isolation-trials', // https://source.chromium.org/search?q=lang:cpp+symbol:kDisableSiteIsolation&ss=chromium
            '--disable-speech-api', // https://source.chromium.org/search?q=lang:cpp+symbol:kDisableSpeechAPI&ss=chromium
            '--disable-web-security', // https://source.chromium.org/search?q=lang:cpp+symbol:kDisableWebSecurity&ss=chromium
            '--disk-cache-size=33554432', // https://source.chromium.org/search?q=lang:cpp+symbol:kDiskCacheSize&ss=chromium
            '--enable-features=SharedArrayBuffer', // https://source.chromium.org/search?q=file:content_features.cc&ss=chromium
            '--hide-scrollbars', // https://source.chromium.org/search?q=lang:cpp+symbol:kHideScrollbars&ss=chromium
            '--ignore-gpu-blocklist', // https://source.chromium.org/search?q=lang:cpp+symbol:kIgnoreGpuBlocklist&ss=chromium
            '--in-process-gpu', // https://source.chromium.org/search?q=lang:cpp+symbol:kInProcessGPU&ss=chromium
            '--mute-audio', // https://source.chromium.org/search?q=lang:cpp+symbol:kMuteAudio&ss=chromium
            '--no-default-browser-check', // https://source.chromium.org/search?q=lang:cpp+symbol:kNoDefaultBrowserCheck&ss=chromium
            '--no-pings', // https://source.chromium.org/search?q=lang:cpp+symbol:kNoPings&ss=chromium
            '--no-sandbox', // https://source.chromium.org/search?q=lang:cpp+symbol:kNoSandbox&ss=chromium
            '--no-zygote', // https://source.chromium.org/search?q=lang:cpp+symbol:kNoZygote&ss=chromium
            '--use-gl=swiftshader', // https://source.chromium.org/search?q=lang:cpp+symbol:kUseGl&ss=chromium
            '--window-size=1920,1080', // https://source.chromium.org/search?q=lang:cpp+symbol:kWindowSize&ss=chromium
        ];
        if (BrowserSettings.headless === true) {
            result.push('--single-process'); // https://source.chromium.org/search?q=lang:cpp+symbol:kSingleProcess&ss=chromium
        } else {
            result.push('--start-maximized'); // https://source.chromium.org/search?q=lang:cpp+symbol:kStartMaximized&ss=chromium
        }

        return result;

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

            result.push("--proxy-server={proxyProtocol}{proxy}");
        }

        if ((this._userAgentProvider != null)) {
            let useragent = this.GetUserAgent();
            if (!string.IsNullOrEmpty(useragent)) {
                Log.Debug("{nameof(useragent)}: {useragent}");
                result.push("--user-agent=""""{useragent}""""");
            }

        }

        if (this._noProxy) {
            result.push("--no-proxy-server");
        }

        result.AddRange(this._addedArgs);
        return result;
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
