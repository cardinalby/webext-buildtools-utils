export interface IManifestObject {
    manifest_version: number
    name: string;
    version: string;
    author?: string,
    description?: string;
    [key: string]: any;
}