import { IBuildAssetsCollection, IBuildResult } from 'webext-buildtools-builder-types';

// noinspection JSUnusedGlobalSymbols
export class BaseBuildResult<TAssetsCollection extends IBuildAssetsCollection> implements IBuildResult {
    protected _assets: TAssetsCollection;
    protected _hasWarnings: boolean | undefined;

    constructor(assets?: TAssetsCollection, hasWarnings?: boolean) {
        this._hasWarnings = hasWarnings;
        this._assets = assets ? assets : {} as TAssetsCollection;
    }

    public getAssets(): TAssetsCollection {
        return this._assets;
    }

    // noinspection JSUnusedGlobalSymbols
    public setWarnings(hasWarnings: boolean | undefined): this {
        this._hasWarnings = hasWarnings;
        return this;
    }

    public hasWarnings(): boolean {
        return this._hasWarnings !== undefined
            ? this._hasWarnings
            : Object.keys(this._assets).length === 0;
    }


}
