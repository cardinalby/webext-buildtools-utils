import { IBuildAsset, ISimpleBuilder } from 'webext-buildtools-builder-types';
import { SubBuilderRecord } from './subBuilderRecord';

interface IPassOnAsset<TValue> {
    to<TDstBuilder extends ISimpleBuilder<any>>(
        builderRecord: SubBuilderRecord<any, TDstBuilder>,
        setAction: (builder: TDstBuilder, asset: TValue) => void): IPassOnAsset<TValue>;
}

class PassOnAsset<TValue> implements  IPassOnAsset<TValue> {
    protected readonly _asset: IBuildAsset<TValue> | undefined;

    constructor(asset: IBuildAsset<TValue> | undefined) {
        this._asset = asset;
    }

    public to<TDstBuilder extends ISimpleBuilder<any>>(
        builderRecord: SubBuilderRecord<any, TDstBuilder>,
        setAction: (builder: TDstBuilder, asset: TValue) => void
    ): IPassOnAsset<TValue>
    {
        if (this._asset && builderRecord.builder) {
            setAction(builderRecord.builder, this._asset.getValue());
        }
        return this;
    }
}

export function passOnAsset<TValue>(asset: IBuildAsset<TValue> | undefined): IPassOnAsset<TValue> {
    return new PassOnAsset(asset);
}

