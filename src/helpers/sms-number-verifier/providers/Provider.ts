import { INumberOptions, ISMSOptions } from '../../../interfaces';
/**
 * Abstract base class for SMS OTP providers.
 */
export default abstract class Provider {
    /**
     * Provider name.
     *
     * @member {string}
     */
    abstract get name (): string | Error

    /**
     */
    // @ts-ignore
    abstract async getNumbers (options: INumberOptions): Promise<Array<any>> | Error

    /**
     */
    // @ts-ignore
    abstract async getMessages (options: ISMSOptions): Promise<Array<any>> | Error
}
