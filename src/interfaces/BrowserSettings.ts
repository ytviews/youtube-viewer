export interface IChromiumSettings {

    GetPath(): string;

    GetHeadless(): boolean;

    ServiceCode: ServiceCode;

    Proxy: string;

    GetUserAgent(): string;

    GetArgs(): IEnumerable<string>;

    AddArg(arg: string): void;

    ClearArgs(): void;

    GetProxy(serviceCode: ServiceCode): string;

    MarkProxySuccess(serviceCode: ServiceCode, proxy: string): void;

    MarkProxyFail(serviceCode: ServiceCode, proxy: string): void;
}
