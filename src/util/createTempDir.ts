import sanitizeFileName from 'sanitize-filename';
import * as temp from 'temp';

// noinspection JSUnusedGlobalSymbols
export function createTempDir(prefix: string): Promise<string> {
    return new Promise((resolve, reject) => {
        temp.mkdir('webext_' + sanitizeFileName(prefix), (err, dirPath) => {
            if (err) {
                reject(err);
            } else {
                resolve(dirPath);
            }
        });
    });
}
