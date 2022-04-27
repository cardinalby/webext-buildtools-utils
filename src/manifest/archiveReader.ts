import {IManifestObject} from "../../declarations/manifest";
import * as fs from "fs-extra";
import { unzipFile } from '../unzip/fileUnzip'
import {validateManifestFile} from "./manifestValidator";
import {ReadableStreamBuffer} from "../util/readableStreamBuffer";

export const MANIFEST_FILE_NAME = 'manifest.json';

export async function extractManifestFromZipFile(zipFilePath: string): Promise<IManifestObject> {
    const readStream = fs.createReadStream(zipFilePath);
    let buffer: Buffer|undefined;
    try {
        buffer = await unzipFile(readStream, MANIFEST_FILE_NAME);
    } catch (e) {
        throw new Error(`Error reading ${zipFilePath}: ` + String(e));
    }
    return validateManifestFile(buffer);
}

export async function extractManifestFromZipBuffer(zipBuffer: Buffer): Promise<IManifestObject> {
    const readableStream = new ReadableStreamBuffer(zipBuffer);
    const buffer = await unzipFile(readableStream, MANIFEST_FILE_NAME);
    return validateManifestFile(buffer);
}