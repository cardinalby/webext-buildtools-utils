import { IBuildAsset } from 'webext-buildtools-builder-types';

// noinspection JSUnusedGlobalSymbols
export class BasicTypeBuildAsset<TValue> implements IBuildAsset<TValue> {
    protected _value: TValue;

    constructor(value: TValue) {
        this._value = value;
    }

    public getValue(): TValue {
        return this._value;
    }
}
