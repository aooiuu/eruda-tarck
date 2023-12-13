# eruda-track

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]

类似浏览器插件 [GrowingIO Web Debugger](https://docs.growingio.com/v3/developer-manual/debugging/web-debugger) 的 Eruda 埋点插件, 通过拦截 `window.navigator.sendBeacon` 实现埋点请求记录。


![1](https://github.com/aooiuu/eruda-track/assets/28108111/022bb3b1-5959-4cd6-8ac2-76d1acef41dd)
![2](https://github.com/aooiuu/eruda-track/assets/28108111/abb4a953-71f9-4022-bfb9-61550fc2e0f3)

## Usage

```sh
npm i eruda-track
```

```javascript
import erudaTrack from 'eruda-track';

eruda.add(erudaTrack);
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/eruda-track?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/eruda-track
[bundle-src]: https://img.shields.io/bundlephobia/minzip/eruda-track?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=eruda-track
[jsdocs-src]: https://img.shields.io/badge/jsDocs.io-reference-18181B?style=flat&colorA=18181B&colorB=F0DB4F
[jsdocs-href]: https://www.jsdocs.io/package/eruda-track
