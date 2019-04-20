import { IDisposableBuildAsset } from 'webext-buildtools-builder-types';

export abstract class AbstractDisposableBuildAsset<TValue> implements IDisposableBuildAsset<TValue> {
    /** could be set to undefined in disposeImpl() */
    protected _value?: TValue;
    protected _disposed: boolean = false;
    protected readonly _temporary: boolean;

    protected constructor(value: TValue, temporary: boolean) {
        this._value = value;
        this._temporary = temporary;
    }

    public async dispose(): Promise<any> {
        if (!this._disposed) {
            return this.disposeImpl().then(disposeResult => {
                this._disposed = true;
                return disposeResult;
            });
        }
    }

    // noinspection JSUnusedGlobalSymbols
    public isDisposed(): boolean {
        return this._disposed;
    }

    public getValue(): TValue {
        if (!this._disposed) {
            return this._value as TValue;
        }
        throw new Error('Resource was disposed');
    }

    public isTemporary(): boolean {
        return this._temporary;
    }

    protected abstract disposeImpl(): Promise<any>;
}
