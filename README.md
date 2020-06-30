![npm-publish](https://github.com/cardinalby/webext-buildtools-utils/workflows/npm-publish/badge.svg)
### Introduction
Common utils for *webext-buildtools* builders.

If you need complete solution for Web Extension build/deploy, go to [webext-buildtools-integrated-builder](https://github.com/cardinalby/webext-buildtools-integrated-builder) repo.  

To read what are *webext-buildtools* and *builders* go to [webext-buildtools-builder-types](https://github.com/cardinalby/webext-buildtools-builder-types) repo.
### Installation
`npm install webext-buildtools-utils`
### Details
Under `src` dir package contains helper classes to implement own `ISimpleBuilder`.

* `buildAsset` dir contains implementations for `IBuildAsset`
* `builder` dir contains:
    1. `AbstractSimpleBuilder` class to implement own `ISimpleBuilder` on base of it
    2. `AbstractCompositeBuilder` class to compose several builders into one    
* `buildResult` dir with base class for build results with custom assets set
* `utils` dir with helpers for common tasks

All the classes are exported in `index.js`  