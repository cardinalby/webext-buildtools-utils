import { ILogMethod } from 'webext-buildtools-builder-types';

/**
 * Npm levels from triple-beam
 */
export enum LogLevels {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    HTTP = 'http',
    VERBOSE = 'verbose',
    DEBUG = 'debug',
    SILLY = 'silly',
}

// noinspection JSUnusedGlobalSymbols
export class LoggerWrapper {
    public logMethod?: ILogMethod;

    public constructor(logMethod?: ILogMethod) {
        this.logMethod = logMethod;
    }

    // noinspection JSUnusedGlobalSymbols
    public log(level: LogLevels, message: string, ...extra: any[]) {
        if (this.logMethod) {
            this.logMethod(level, message, ...extra);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    public error(message: string, ...extra: any[]) {
        this.log(LogLevels.ERROR, message, ...extra);
    }

    // noinspection JSUnusedGlobalSymbols
    public warn(message: string, ...extra: any[]) {
        this.log(LogLevels.WARN, message, ...extra);
    }

    // noinspection JSUnusedGlobalSymbols
    public info(message: string, ...extra: any[]) {
        this.log(LogLevels.INFO, message, ...extra);
    }

    // noinspection JSUnusedGlobalSymbols
    public http(message: string, ...extra: any[]) {
        this.log(LogLevels.HTTP, message, ...extra);
    }

    // noinspection JSUnusedGlobalSymbols
    public verbose(message: string, ...extra: any[]) {
        this.log(LogLevels.VERBOSE, message, ...extra);
    }

    // noinspection JSUnusedGlobalSymbols
    public debug(message: string, ...extra: any[]) {
        this.log(LogLevels.DEBUG, message, ...extra);
    }

    // noinspection JSUnusedGlobalSymbols
    public silly(message: string, ...extra: any[]) {
        this.log(LogLevels.SILLY, message, ...extra);
    }
}
