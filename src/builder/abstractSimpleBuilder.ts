import { IBuildResult, ILogMethod, ISimpleBuilder } from 'webext-buildtools-builder-types';
// noinspection TypeScriptPreferShortImport
import { LoggerWrapper } from '../util/loggerWrapper';

export interface IAbstractSimpleBuilderClass<TBuilder, TOptions> {
    TARGET_NAME: string;
    new (options: TOptions, logMethod?: ILogMethod): TBuilder;
}

// noinspection JSUnusedGlobalSymbols
export abstract class AbstractSimpleBuilder<TOptions, TBuildResult extends IBuildResult>
    implements ISimpleBuilder<TBuildResult>
{
    protected readonly _options: TOptions;
    protected readonly _logWrapper: LoggerWrapper;

    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    /**
     * @param options
     * @param logMethod
     */
    public constructor(options: TOptions, logMethod?: ILogMethod) {
        this._options = options;
        this._logWrapper = new LoggerWrapper(logMethod);
    }

    public abstract getTargetName(): string;
    public abstract async build(): Promise<TBuildResult>;

    // noinspection JSUnusedGlobalSymbols
    public getOptions(): TOptions {
        return this._options;
    }

    // noinspection JSUnusedGlobalSymbols
    public getLogWrapper(): LoggerWrapper {
        return this._logWrapper;
    }
}
