# Under active development. Come back soon!

<div align="center">
  <img src="https://github.com/augm-dev/augm-it/raw/master/augm.png" alt="augm logo" width="60" />
</div>

<h1 align="center">augm-it</h1>
<div align="center">
  <a href="https://npmjs.org/package/augm-it">
    <img src="https://badgen.now.sh/npm/v/augm-it" alt="version" />
  </a>
  <a href="https://bundlephobia.com/result?p=augm-it">
    <img src="https://img.badgesize.io/augm-dev/augm-it/master/min.js?compression=brotli" alt="install size" />
  </a>
</div>

Automatic client-side saturation for [SSR components](https://github.com/MarshallCB/componit) and Custom Elements.

Pairs well with [componit](https://github.com/MarshallCB/componit) (isomorphic component builder)

## Usage

```js
import augmit from 'augm-it'
import { uhtml, render, svg } from 'uhtml'

/* augmit will asynchronously import components stored in [host]/components/[id].augm-it.js
 * augmit will saturate: <it-[id] />, <div is="it-[id]"></div>, <div class="it-[id]"></div> 
 * augmit will bind the runtime to each imported component
 */
let saturation = augmit("/components", {
  runtime: {
    html() { return render(this.element, html.apply(null, arguments)) },
    svg() { return render(this.element, svg.apply(null, arguments)) }
  },
  extension: ".augm-it.js",
  container: document.getElementById('app')
})

// Stop observing
saturation.disconnect()
```

## Motivation

Loading component saturation asynchronously allows for minimal FMP (first meaningful paint). The size of this library is tiny, and if your runtime is also small (or non-existent), TTI (time-to-interactive) will be very fast. 

By not bundling components, each page only loads what it needs, and you can easily have a library of 100+ potential components without bloating your site (huge win).

This approach takes advantage of:
- HTTP/2 parallel download speed [caniuse](https://caniuse.com/http2)
- Asynchronous import [caniuse](https://caniuse.com/es6-module-dynamic-import) [polyfill](https://github.com/GoogleChromeLabs/dynamic-import-polyfill)

## Acknowledgements

Inspired by [`uce-loader`](https://github.com/WebReflection/uce-loader) by [@WebReflection](https://github.com/WebReflection).

Uses [`wicked-elements`](https://github.com/WebReflection/wicked-elements) by [@WebReflection](https://github.com/WebReflection) for CustomElement-like API for saturation.