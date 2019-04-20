import * as _ from 'lodash';
import { ILogMethod } from 'webext-buildtools-builder-types';

interface ILogMethodProxyOptions {
    msgPrefix?: string;
    msgSuffix?: string;
    levelsMap?: {
        // from: to
        // null value suppresses output
        [originalLevel: string]: string | null;
    }
}

// noinspection JSUnusedGlobalSymbols
export function logMethodProxy(logMethod: ILogMethod, options: ILogMethodProxyOptions): ILogMethod {
    return (level: string, message: string, ...meta: any[]) => {
        if (_.isObject(options.levelsMap) && options.levelsMap[level] !== undefined) {
            const mappedLevel = options.levelsMap[level];
            if (mappedLevel === null) {
                return;
            }
            level = mappedLevel;
        }

        if (options.msgPrefix) {
            message = options.msgPrefix + message;
        }

        if (options.msgSuffix) {
            message = message + options.msgSuffix;
        }

        logMethod(level, message, meta);
    }
}