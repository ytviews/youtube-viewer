/**
 * Launcher options that only apply to Chrome.
 *
 * @public
 */
export interface ChromeArgOptions {
    headless?: boolean;
    args?: string[];
    userDataDir?: string;
    devtools?: boolean;
}

/**
 * Generic launch options that can be passed when launching any browser.
 * @public
 */
export interface LaunchOptions {
    executablePath?: string;
    ignoreDefaultArgs?: boolean | string[];
    handleSIGINT?: boolean;
    handleSIGTERM?: boolean;
    handleSIGHUP?: boolean;
    timeout?: number;
    dumpio?: boolean;
    env?: Record<string, string | undefined>;
    pipe?: boolean;
}
