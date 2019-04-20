import * as fs from 'fs-extra';
import * as path from 'path';
import sanitizeFileName from 'sanitize-filename';
import { Readable, Stream } from 'stream';
// noinspection TypeScriptPreferShortImport
import { createTempDir } from '../util/createTempDir';
import { AbstractDisposableBuildAsset } from './abstractDisposableBuildAsset';

function writeFinished(stream: Stream) {
    return new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
}

async function writeToFile(filePath: string, src: Buffer | Readable) {
    try {
        if (Buffer.isBuffer(src)) {
            await fs.writeFile(filePath, src);
        } else {
            const writeStream = fs.createWriteStream(filePath);
            src.pipe(writeStream);
            src.on('error', err => {
                writeStream.emit('error', err);
            });
            await writeFinished(writeStream);
        }
    } catch (error) {
        try {
            await fs.unlink(filePath);
        } catch (error) {}
        throw error;
    }
}

// noinspection JSUnusedGlobalSymbols
/**
 * Value is file path
 */
export class FileBuildAsset extends AbstractDisposableBuildAsset<string> {
    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {string} filePath save to path
     * @param {Buffer} src file contents
     */
    public static async writeAndCreatePersistent(
        filePath: string,
        src: Buffer | Readable,
    ): Promise<FileBuildAsset> {
        await fs.ensureDir(path.dirname(filePath));
        await writeToFile(filePath, src);
        return Promise.resolve(new FileBuildAsset(false, filePath));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {string} tmpDirPrefix prefix of temporary dir
     * @param {string} fileName file name inside dir
     * @param {Buffer} src file contents
     */
    public static async writeAndCreateTemporary(
        tmpDirPrefix: string,
        fileName: string,
        src: Buffer | Readable,
    ): Promise<FileBuildAsset> {
        const tempDirPath = await createTempDir(tmpDirPrefix);
        const filePath = path.join(tempDirPath, sanitizeFileName(fileName));
        try {
            await writeToFile(filePath, src);
            return Promise.resolve(new FileBuildAsset(true, filePath, tempDirPath));
        } catch (error) {
            try {
                await fs.rmdir(tempDirPath);
            } catch (error) {}
            throw error;
        }
    }

    protected _tempDirPath?: string;

    constructor(temporary: boolean, filePath: string, tempDirPath?: string) {
        super(filePath, temporary);
        this._tempDirPath = tempDirPath;
    }

    // noinspection JSUnusedGlobalSymbols
    public getTempDirPath(): string | undefined {
        return this._tempDirPath;
    }

    protected async disposeImpl() {
        if (this._value) {
            await fs.remove(this._value);
            this._value = undefined;
        }
        if (this._tempDirPath) {
            await fs.remove(this._tempDirPath);
            this._tempDirPath = undefined;
        }
    }
}
