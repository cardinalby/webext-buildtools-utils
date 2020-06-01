import { Readable, Stream } from 'stream';
import { WritableStreamBuffer } from '../util/writableStreamBuffer';
import { BasicTypeBuildAsset } from './basicTypeBuildAsset';

function writeFinished(stream: Stream) {
    return new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
}

export class BufferBuildAsset extends BasicTypeBuildAsset<Buffer> {
    // noinspection JSUnusedGlobalSymbols
    public static async createFromStream(src: Readable): Promise<BufferBuildAsset> {
        const writeStream = new WritableStreamBuffer();

        src.pipe(writeStream);
        src.on('error', err => {
            writeStream.emit('error', err);
        });
        await writeFinished(writeStream);
        const contents = writeStream.getContents();
        if (contents === false) {
            throw new Error('Empty buffer');
        }

        return new BufferBuildAsset(contents);
    }
}
