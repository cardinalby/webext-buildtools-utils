import {Readable, ReadableOptions} from "stream";

export class ReadableStreamBuffer extends Readable {
    private _buffer: Buffer|null;

    constructor(buffer: Buffer, opts?: ReadableOptions) {
        super({...opts, objectMode: false});
        this._buffer = buffer;
    }

    _read(size: number) {
        this.push(this._buffer);
        this._buffer = null;
    }
}