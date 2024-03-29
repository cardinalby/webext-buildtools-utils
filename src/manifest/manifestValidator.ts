import {IManifestObject} from "../../declarations/manifest";

export function validateManifestFile(contents: Buffer|string): IManifestObject {
    let manifestObject: { [k: string]: any }|undefined;
    try {
        manifestObject = JSON.parse(contents.toString());
    } catch (err) {
        throw new Error("Can't parse JSON in manifest file: " + String(err));
    }
    if (manifestObject !== undefined) {
        return validateManifestObject(manifestObject);
    }
    throw new Error('Error parsing manifest file');
}

export function validateManifestObject(data: { [k: string]: any }|IManifestObject): IManifestObject {
    const errors = [];

    if (typeof data.manifest_version !== 'number') {
        errors.push('manifest_version is missing or not a number');
    }
    if (typeof data.name !== 'string') {
        errors.push('name is missing or not a string');
    }
    if (typeof data.version !== 'string') {
        errors.push('version is missing or not a string');
    }
    if (errors.length > 0) {
        throw new Error(errors.join('; '));
    }
    return data as IManifestObject;
}