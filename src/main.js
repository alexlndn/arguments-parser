import { readFileSync } from 'node:fs';
import chalk from 'chalk';
import { writeLog } from './modules/log.js';
import { utils } from './helpers/utils.js';
import { join as pathJoin } from 'node:path';

function readMapping() {
    try {
        const data = readFileSync(
            pathJoin(process.cwd(), '/config/arguments-parser.json'),
            { flag: 'r', encoding: 'utf8' },
        );
        return data ? JSON.parse(data) : null;
    } catch (err) {
        writeLog(
            `${chalk.cyan(chalk.yellow('Warning: '))}${chalk.blueBright(
                'arguments-parser',
            )} not configured.`,
        );
        writeLog(
            `Please create ${chalk.blueBright('arguments-parser.json')} inside ${chalk.blueBright('config')} folder in project root folder.`,
        );
        writeLog(
            `Otherwise if you don't want to configure it, please set ${chalk.blueBright(
                'explicit',
            )} property to false in main configuration.\n`,
        );

        return null;
    }
}

const processArgs = (config) => {
    const args = process.argv.slice(config.offset ? config.offset : 2);

    // raw params array
    if (config.onlyParamsArray) {
        return args;
    }

    const processed = {};

    let actualArg;

    while (args[0] && args[0].length) {
        if (utils.isKey(args[0])) {
            actualArg = args.shift();

            if (utils.isCompact(actualArg)) {
                const val = utils.getValue(actualArg);
                actualArg = utils.getKey(actualArg);
                processed[actualArg] = [];
                processed[actualArg].push(val);
            } else {
                actualArg = utils.getKey(actualArg);
                processed[actualArg] = [];
            }

        } else {
            const actualValue = args.shift();

            if (typeof processed[actualArg] === 'undefined') {
                processed[actualArg] = [];
            }

            processed[actualArg].push(actualValue);
        }
    }

    for (const key of Object.keys(processed)) {
        processed[key] = utils.parseValue(processed[key]);

        if (processed[key].length === 0) {
            processed[key].push(true);
        }

        if (!config.keepAsArray) {
            if (processed[key].length === 1) {
                processed[key] = processed[key][0];
            }
        }
    }

    return processed;
};

function argumentsParser(config = {}) {
    const args = processArgs(config);

    if (config.onlyParamsArray) {
        return args;
    }

    const mapping = config && config.explicit ? readMapping() : null;
    let result = {};

    if (mapping) {
        for (const map of mapping) {
            let key;
            if (Array.isArray(map)) {
                const baseKey = utils.getKey(map[0]);

                for (const intKey of map) {
                    key = utils.getKey(intKey);
                    const keyValue = args[key];
                    if (typeof keyValue !== 'undefined') {
                        result[baseKey] = keyValue;
                    }
                }
                // establecer el base
                const keyValue = args[baseKey];
                if (typeof keyValue !== 'undefined') {
                    result[baseKey] = keyValue;
                }
            } else if (typeof map === 'string') {
                key = utils.getKey(map);
                const keyValue = args[key];

                if (typeof keyValue !== 'undefined') {
                    result[key] = keyValue;
                }
            }
        }
    } else {
        result = args;
    }
    return result;
}

export default argumentsParser;
