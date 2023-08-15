import chalk from 'chalk';
import { writeLog } from '../modules/log.js';

function isKey (str) {
    if (!typeof str === 'undefined' || str === null) {
        writeLog(
            chalk.yellowBright(
                'Invalid value for param "str"',
            ),
        );
    }
    return str && str.startsWith('-');
}

function isCompact (str) {
    return str && str.indexOf('=') > -1;
}

function getKey (str) {
    if (typeof str === 'undefined' || str === null) {
        writeLog(
            chalk.yellowBright(
                'Invalid value for param "str"',
            ),
        );
        return;
    }
    const index = str.indexOf('=');
    return index > -1
        ? str.slice(0, index).replace(/^-+/g, '')
        : str.replace(/^-+/g, '');
}

function getValue(str) {
    if (typeof str === 'undefined' || str === null) {
        writeLog(
            chalk.yellowBright(
                'Invalid value for param "str"',
            ),
        );
        return;
    }
    const index = str.indexOf('=');
    return str.slice(index + 1, str.length);
}

function parseValue (value) {
    value.forEach((val, index) => {
        if (!isNaN(parseInt(val, 10))) {
            value[index] = parseInt(val);
            return;
        }

        if (['true' || 'false'].includes(val)) {
            value[index] = Boolean(val.replace('false', ''));
        }
    });

    return value;
}

export const utils = {
    getKey,
    getValue,
    isKey,
    isCompact,
    parseValue,
};
