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
    abstract async getNumbers (options): Promise<Array<any>> | Error

    /**
     */
    // @ts-ignore
    abstract async getMessages (options): Promise<Array<any>> | Error
}
