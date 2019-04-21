import * as _ from 'lodash';
import {
    IBuildAsset, IBuildAssetsCollection, IBuildResult,
    IDisposableBuildAsset,
    ILogMethod,
    ISimpleBuilder,
} from 'webext-buildtools-builder-types';
// noinspection TypeScriptPreferShortImport
import { FileBuildAsset } from '../buildAsset/fileBuildAsset';
import { ICompositeBuildResult } from './abstractCompositeBuilder/compositeBuildResult';
import { SubBuilderRecord } from './abstractCompositeBuilder/subBuilderRecord';
import { AbstractSimpleBuilder } from './abstractSimpleBuilder';

/**
 * Class to compose several builders into one
 */
export abstract class AbstractCompositeBuilder<TOptions, TBuildResult extends ICompositeBuildResult>
    extends AbstractSimpleBuilder<TOptions, TBuildResult> 
    implements ISimpleBuilder<TBuildResult> 
{
    protected readonly _builders: Map<string, SubBuilderRecord<this, any>> = new Map();
    protected readonly _stopOnWarning: boolean;
    protected readonly _stopOnError: boolean;

    protected constructor(
        options: TOptions,
        logMethod?: ILogMethod,
        stopOnWarning: boolean = true,
        stopOnError: boolean = true,
    ) {
        super(options, logMethod);
        this._stopOnWarning = stopOnWarning;
        this._stopOnError = stopOnError;
    }

    // noinspection JSUnusedGlobalSymbols
    get builders(): Map<string, SubBuilderRecord<this, any>> {
        return this._builders;
    }

    // noinspection JSUnusedGlobalSymbols
    public addBuilder<TSubBuilder extends ISimpleBuilder<any>>(
        targetName: string,
        builder: TSubBuilder | null,
        buildOrder: number,
        active: boolean = false
    ): SubBuilderRecord<this, TSubBuilder>
    {
        const record = new SubBuilderRecord<this, TSubBuilder>(targetName, builder, buildOrder, active);
        this._builders.set(targetName, record);
        return record;
    }

    public async build(): Promise<TBuildResult> {
        const compositeBuildResult = this.createBuildResult();
        // key: target_name, value: build result assets
        const outAssets = new Map<string, IBuildAssetsCollection>();

        const orderedBuilders = this.getOrderedBuilders();

        try {
            for (const builder of orderedBuilders) {
                if (!(await this.performBuildFor(builder, compositeBuildResult, outAssets))) {
                    return compositeBuildResult;
                }
            }
        }
        finally {
            await this.disposeOutAssets(outAssets);
        }

        this.logBuildResult(compositeBuildResult);

        return compositeBuildResult;
    }

    protected abstract createBuildResult(): TBuildResult;

    protected getOrderedBuilders(): Array<SubBuilderRecord<this, any>> {
        const buildersArray = Array.from(this._builders.values());
        return buildersArray.sort((a, b) => {
            return a.buildOrder - b.buildOrder;
        });
    }

    /**
     * @return boolean continue whole build process or not
     * @param builder
     * @param compositeBuildResult
     * @param outAssets key: target_name, value: build result assets
     */
    protected async performBuildFor(
        builder: SubBuilderRecord<this, any>,
        compositeBuildResult: TBuildResult,
        outAssets: Map<string, IBuildAssetsCollection>
    ): Promise<boolean>
    {
        const targetName = builder.targetName;

        if (!builder.active) {
            this._logWrapper.debug(`${targetName} omitted`);
            return true;
        }

        this._logWrapper.info(`Starting ${targetName}...`);
        try {
            // @ts-ignore
            const builderResult = await builder.build(compositeBuildResult);
            outAssets.set(targetName, builderResult.getAssets());
            this.addAssetsToCompositeResult(builder, compositeBuildResult, builderResult);
            if (builderResult.hasWarnings() && this._stopOnWarning) {
                this._logWrapper.error(`${targetName} finished with warnings. Stopping build`);
                return false;
            }
        } catch (error) {
            compositeBuildResult.errors.push({ targetName, error });
            if (this._stopOnError || this._stopOnWarning) {
                this._logWrapper.error(`${targetName} finished with error: ${error}. Stopping build`);
                throw error;
            }
        }

        return true;
    }

    protected addAssetsToCompositeResult(
        subBuilder: SubBuilderRecord<this, any>,
        compositeResult: TBuildResult,
        subBuilderResult: IBuildResult
    ) {
        for (const subBuilderAssetKey of subBuilder.assetsRequiredForCompositeResult.keys()) {
            const compositeResultAssetKey = subBuilder.assetsRequiredForCompositeResult.get(subBuilderAssetKey) as string;
            const compositeAssets = compositeResult.getAssets();
            const subBuilderAssets = subBuilderResult.getAssets();
            compositeAssets[compositeResultAssetKey] = subBuilderAssets[subBuilderAssetKey];
        }
    }

    /**
     * Dispose disposable assets after build
     */
    protected async disposeOutAssets(outAssets: Map<string, IBuildAssetsCollection>) {
        for (const targetName of outAssets.keys()) {
            const assetCollection = outAssets.get(targetName);
            if (!assetCollection) {
                continue;
            }

            for (const assetName of Object.keys(assetCollection)) {
                const asset = assetCollection[assetName];
                if (!asset) {
                    continue;
                }

                const disposableAsset = asset as IDisposableBuildAsset<any>;
                if (_.isFunction(disposableAsset.dispose) &&
                    _.isFunction(disposableAsset.isTemporary) &&
                    _.isFunction(disposableAsset.isDisposed)
                ) {
                    try {
                        if (disposableAsset.isTemporary() && !disposableAsset.isDisposed()) {
                            this.logDisposingMessage(asset, assetName, targetName);
                            await disposableAsset.dispose();
                        }
                    } catch (e) {
                        this._logWrapper.error('Error during disposing temporary out asset: ' + e.toString());
                    }
                }
            }
        } 
    }

    protected logBuildResult(result: TBuildResult) {
        if (!result.hasWarnings() && result.errors.length === 0) {
            this._logWrapper.info('All build steps finished successfully');
        }
        else if (result.errors.length > 0) {
            this._logWrapper.error('Build finished with errors:');
            for (const err of result.errors) {
                this._logWrapper.error(`${err.targetName}: ${err.error}`);
            }
        }
        else if (result.hasWarnings()) {
            this._logWrapper.error('Build finished with warnings');
        }
    }

    protected logDisposingMessage(asset: IBuildAsset<any>, assetName: string, targetName: string) {
        if (asset instanceof FileBuildAsset) {
            this._logWrapper.info(
                `Removing temp ${assetName} file ('${asset.getValue()}') from '${targetName}'...`
            );
        } else {
            this._logWrapper.info(
                `Disposing asset '${assetName}' from '${targetName}'...`
            );
        }
    }
}