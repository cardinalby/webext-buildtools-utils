export class CallbacksCollection<TArgs extends any[]>
{
    protected _callbacks = new Array<(...args: TArgs) => any>();

    // noinspection JSUnusedGlobalSymbols
    public get size(): number {
        return this._callbacks.length;
    }

    public add(callback: (...args: TArgs) => any) {
        this._callbacks.push(callback);
    }

    public fire(...args: TArgs): any {
        for (const callback of this._callbacks) {
            callback(...args);
        }
    }
}