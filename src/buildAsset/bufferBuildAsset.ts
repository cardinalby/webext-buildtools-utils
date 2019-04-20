import { Readable, Stream } from 'stream';
import { WritableStreamBuffer } from 'stream-buffers';
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

        return new BufferBuildAsset(writeStream.getContents());
    }
}
