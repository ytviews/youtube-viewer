// import * as path from 'path';
import fs  from 'fs';
import { Command } from 'commander';
import { BaseCommander } from '../../interfaces';
import { URL_FILE_PROXIES, logger } from '../../utils';

export class CommanderProgram implements BaseCommander {
    async main(command: Command): Promise<void> {
        const options = command.opts();
        logger.debug(options);
        let proxyListSourcesRaw;
        try {
            proxyListSourcesRaw = fs.readFileSync(URL_FILE_PROXIES, {encoding: 'utf8'});
        } catch(err) {
            logger.error(`Error opening file: ${URL_FILE_PROXIES}`);
            process.exit(1);
        }
        const proxyListSources = proxyListSourcesRaw.split(/\r?\n/).filter(line => !!line);
        logger.info(`Scraping from ${proxyListSources.length} sources...`);
        // const proxies = proxyListSources.map(s => s.replace(/\s+/, ':')).filter(l => !!l.trim());
        for (const source of proxyListSources) {
            logger.info(`Requesting page ${source}...`);
        }
        return Promise.resolve(undefined);
    }
}
