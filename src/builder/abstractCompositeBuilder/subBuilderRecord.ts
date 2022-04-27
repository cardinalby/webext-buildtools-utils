import { BuildResultOf, ISimpleBuilder } from 'webext-buildtools-builder-types';
import { AbstractCompositeBuilder } from '../abstractCompositeBuilder';
import { CallbacksCollection } from './callbacksCollection';

export class SubBuilderRecord<
        TCompositeBuilder extends AbstractCompositeBuilder<any, any>,
        TSubBuilder extends ISimpleBuilder<any>
    >
{
    protected readonly _targetName: string;
    protected readonly _builder: TSubBuilder | null;
    protected _buildOrder: number;
    protected _active: boolean;
    /**
     * key: subBuilder result's asset key, value: composite result's key
     */
    protected readonly _assetsRequiredForCompositeResult = new Map<string, string>();

    protected readonly _beforeBuild =
        new CallbacksCollection<[
            ISimpleBuilder<BuildResultOf<TSubBuilder>>,
            BuildResultOf<TCompositeBuilder>
            ]>();

    protected readonly _onComplete =
        new CallbacksCollection<[
            ISimpleBuilder<BuildResultOf<TSubBuilder>>,
            BuildResultOf<TSubBuilder>,
            BuildResultOf<TCompositeBuilder>
            ]>();

    protected readonly _onError =
        new CallbacksCollection<[
            ISimpleBuilder<BuildResultOf<TSubBuilder>>,
            Error,
            BuildResultOf<TCompositeBuilder>
            ]>();

    public constructor(
        targetName: string,
        builder: TSubBuilder | null,
        buildOrder: number,
        active: boolean = false
    ) {
        this._targetName = targetName;
        this._builder = builder;
        this._buildOrder = buildOrder;
        this._active = active;
    }

    public get targetName(): string {
        return this._targetName;
    }

    public get builder(): TSubBuilder | null {
        return this._builder;
    }

    public get buildOrder(): number {
        return this._buildOrder;
    }

    // noinspection JSUnusedGlobalSymbols
    public set buildOrder(value: number) {
        this._buildOrder = value;
    }

    public get active(): boolean {
        return this._active;
    }

    // noinspection JSUnusedGlobalSymbols
    public set active(value: boolean) {
        this._active = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * key: subBuilder result's asset key, value: composite result's key
     */
    public get assetsRequiredForCompositeResult(): Map<string, string> {
        return this._assetsRequiredForCompositeResult;
    }

    // noinspection JSUnusedGlobalSymbols
    public beforeBuild(handler: (
        subBuilder: ISimpleBuilder<BuildResultOf<TSubBuilder>>,
        compositeBuildResult: BuildResultOf<TCompositeBuilder>) => any
    ) {
        this._beforeBuild.add(handler);
    }

    // noinspection JSUnusedGlobalSymbols
    public onComplete(handler: (
        subBuilder: ISimpleBuilder<BuildResultOf<TSubBuilder>>,
        buildResult: BuildResultOf<TSubBuilder>,
        compositeBuildResult: BuildResultOf<TCompositeBuilder>) => any
    ) {
        this._onComplete.add(handler);
    }

    // noinspection JSUnusedGlobalSymbols
    public onError(handler: (
        builder: ISimpleBuilder<BuildResultOf<TSubBuilder>>,
        error: Error,
        compositeBuildResult: BuildResultOf<TCompositeBuilder>) => any
    ) {
        this._onError.add(handler);
    }

    public async build(compositeBuildResult: BuildResultOf<TCompositeBuilder>): Promise<BuildResultOf<TSubBuilder>> {
        if (!this._active || !this._builder) {
            throw new Error('Builder is not active or not set');
        }

        this._beforeBuild.fire(this._builder, compositeBuildResult);
        try {
            const result = await this._builder.build();
            this._onComplete.fire(this._builder, result, compositeBuildResult);
            return result;

        }
        catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            this._onError.fire(this._builder, err, compositeBuildResult);
            throw error;
        }
    }
}