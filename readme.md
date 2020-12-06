<h1 align="center">:construction: Under active development. Come back soon! :construction:</h1>

<div align="center">
  <img src="https://github.com/augm-dev/augm-it/raw/overhaul/meta/augm.png" alt="augm logo" width="100" />
</div>

<h1 align="center">augm-it</h1>
<h3 align="center">Lightweight components with multiple delivery strategies</h3>

<div align="center">
  <a href="https://npmjs.org/package/augm-it">
    <img src="https://badgen.now.sh/npm/v/augm-it" alt="version" />
  </a>
  <a href="https://bundlephobia.com/result?p=augm-it">
    <img src="https://img.badgesize.io/augm-dev/augm-it/master/min.js?compression=brotli" alt="install size" />
  </a>
</div>

# Features

- Components are isomorphic (importable on both server and browser)
  - Server: returns an HTML String for server-side rendering (using `utag`)
  - Browser: returns a live DOM Node or fragment (using `uhtml`)
- Write markup, styles, and handler in a single file (modeled after `svelte`)
- Lightweight runtime (~4kb)
- Built on `uhtml`, which is a fast alternative to virtual-dom (VDOM) architectures (`vue`,`react`,`preact`, etc...)
- Automatically generates
  - SSR scripts (prioritizes saturation code & downloads render code on-demand)
    - Optimized saturation script for minimal TTI (time to interactive)
    - Load component render functions on demand
    - Bundled and optimized CSS file to include <head></head>
  - Standalone components (for easy imports on an external site)
    - Automatic saturation of elements with matching css query (`class="it-Example"`)
    - Importable (props)=>(HTML Fragment) for scripts that handle rendering
    - Multiple CSS delivery methods
- Extremely fast builds using `esbuild`

# About

`augm-it` is a developer tool to write succint, simple, and performant components for the web. Think of it as the "glue" between `uhtml`, `wicked-elements`, `utag`, and `esbuild`.

Eventually, [augm.it](https://augm.it) will be an open-source component registry that can host components that are connected to a github repo that uses `augm-it`. 

## Usage

```js
import { html, css } from 'augm-it'

// unique id to connect the handler, styles, and render function
export let it = 'Example'

export let handler={
  init(){
    console.log("Initialized")
  }
  onClick(){
    console.log("Clicked!")
  }
}

export default ({ name }) =>html`
  <div class=${it}>
    Hello ${name}
  </div>
`


// compiles to: .Example{color:#f00};
export let style = css`
  .${it}{
    color: #f00;
  }
`

```

## Acknowledgements

Heavily inspired by @WebReflection's libraries. `augm-it` uses `uhtml` for browser-side rendering and `wicked-elements` for attaching handlers.

DevX inspired by `svelte`