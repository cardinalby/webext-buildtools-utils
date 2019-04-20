import { IBuildAssetsCollection, IBuildResult } from 'webext-buildtools-builder-types';
// noinspection TypeScriptPreferShortImport
import { BaseBuildResult } from '../../buildResult/baseBuildResult';

export interface ICompositeBuildResult extends IBuildResult {
    errors: Array<{targetName: string, error: Error}>;
}

export class CompositeBuildResult<TAssetsCollection extends IBuildAssetsCollection>
    extends BaseBuildResult<TAssetsCollection>
    implements ICompositeBuildResult
{
    public errors = new Array<{targetName: string, error: Error}>();
}