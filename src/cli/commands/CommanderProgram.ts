import { Command } from 'commander';
import { BaseCommander } from '../../interfaces';

export class CommanderProgram implements BaseCommander {
    async main(command: Command): Promise<void> {
        const options = command.opts();
        console.log(options, 'CommanderProgram')
        return Promise.resolve(undefined);
    }
}
