import { Command } from 'commander';
import { BaseCommander } from '../../interfaces';

export class SearcherCommander implements BaseCommander {
    async main(command: Command): Promise<void> {
        const options = command.opts();
        console.log(options, command.args);
        return Promise.resolve(undefined);
    }
}

export const searcherCommander = () => {
    return new Command('search')
        .storeOptionsAsProperties(true)
        .alias('s')
        .description('Search terms in Google')
        .option('-p, --proxy', 'Using Proxy or Tor')
        .action((command: Command) => new SearcherCommander().main(command))
}
