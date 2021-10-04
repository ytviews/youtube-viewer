import { Command } from 'commander';
import {
    viewerCommander,
    accountCommander,
    searcherCommander,
    CommanderProgram,
} from './commands'

new Command('youtube-viewer')
    .storeOptionsAsProperties(true)
    .version('1.0.0', '-v, --version')
    .option('-p, --proxy', 'Using Proxy or Tor')
    .addCommand(accountCommander())
    .addCommand(viewerCommander())
    .addCommand(searcherCommander())
    .description('Youtube viewer')
    .action((command: Command) => new CommanderProgram().main(command))
    .parse(process.argv);
