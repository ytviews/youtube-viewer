import { Command } from 'commander';
import { BaseCommander } from '../../interfaces';

export class AccountCommander implements BaseCommander {
    async main(command: Command): Promise<void> {
        const options = command.opts();
        console.log(options)
        return Promise.resolve(undefined);
    }
}

export const accountCommander = () => {
    return new Command('account')
        .storeOptionsAsProperties(true)
        .description('Generate the Gmail Account')
        .option('-p, --proxy', 'Using Proxy or Tor')
        .action((command: Command) => new AccountCommander().main(command))
}
