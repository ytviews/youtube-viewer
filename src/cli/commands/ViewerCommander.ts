import { Command } from 'commander';
import { BaseCommander } from '../../interfaces';


export class ViewerCommander implements BaseCommander {
    async main(command: Command): Promise<void> {
        const options = command.opts();
        console.log(options);
        return Promise.resolve(undefined);
    }
}

export const viewerCommander = () => {
    return new Command('viewer')
        .storeOptionsAsProperties(true)
        .description('View the YouTube Videos')
        .option('-p, --proxy', 'Using Proxy or Tor')
        .action((command: Command) => new ViewerCommander().main(command))
}
