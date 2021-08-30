import { existsSync, readFileSync } from "fs";
import { IEnv } from "../interfaces/Browser";
import { IMainAccount } from "../interfaces/interfaces";

export class MainSetings {
    public account: IMainAccount;
    constructor(env: IEnv) {
        this.account = this.init(env);
    }

    private init(env: IEnv): IMainAccount {
        const accountFile = `${env.AppPath}/Sites/Gmail/${env.Login}.txt`;
        let acc: IMainAccount;
        if (!existsSync(accountFile)) {
            console.log("Account not Found " + accountFile);
            process.exit();
        } else {
            acc = JSON.parse(readFileSync(accountFile, "utf8"));
            if (acc.status === "suspended") {
                console.log("Account Suspended " + acc);
                process.exit();
            }
            return acc;
        }
    }
}
