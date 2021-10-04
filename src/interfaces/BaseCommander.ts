export interface BaseCommander {
    /**
     * Entry functions
     */
    main: (...args: any[]) => Promise<void>
}
