import * as unzipper from "unzipper";
import {Readable} from "stream";

export async function unzipFile(zipArchive: Readable, filePathInArchive: string): Promise<Buffer> {
    const zip: unzipper.ParseStream = zipArchive.pipe(unzipper.Parse({ forceStream: true }));
    for await (const entry of zip) {
        const unzipperEntry = entry as unzipper.Entry;
        if (unzipperEntry.type === 'File' && unzipperEntry.path === filePathInArchive) {
            return unzipperEntry.buffer();
        } else {
            unzipperEntry.autodrain();
        }
    }
    throw new Error(`${filePathInArchive} file not found in the archive`);
}