export interface IHandler {
    readonly batchCount?: number;
    readonly startPort?: number;
    readonly accounts?: any
    readonly port?: number
}

export interface IAccountsForAction {
    email: string;
    password: string;
}

export interface ICollectionNames {
    firstName: string;
    lastName: string;
    password: string;
}
