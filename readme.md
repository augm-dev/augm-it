<div align="center">
  <img src="https://github.com/augm-dev/augm-it/raw/overhaul/meta/augm.png" alt="augm logo" width="80" />
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

`augm-it` is a developer tool to write succint, simple, and performant components for the web. Think of it as the "glue" between `uhtml`, `wicked-elements`, `uline`, and `esbuild`.

<h1 align="center">:construction: Under active development. Come back soon! :construction:</h1>

# Features

- Write markup (HTML), styles (CSS), and handler (JS) in a single file (modeled after `svelte`)
- Extremely lightweight (~1kb saturation runtime, ~3kB rendering runtime)
- Built on [`uhtml`](https://github.com/WebReflection/uhtml), which is a [fast](https://krausest.github.io/js-framework-benchmark/current.html) tagged-template alternative to virtual-dom (VDOM) architectures (`vue`,`react`,`preact`, etc...)
- Automatically generates
  - SSR-friendly scripts
    - Optimized saturation script for minimal TTI (time to interactive)
    - Load component render functions on demand
    - Bundled and optimized CSS stylesheet
  - Standalone components delivery methods (for easy imports from an external script / page)
    - Automatic saturation of existing elements with matching css query (`class="SpecialButton"`)
    - Importable `(props)=>(HTML Fragment)` standalone component for scripts that handle rendering

## Writing Components

```js
import { html, svg, css, register } from 'augm-it'

// unique class id to connect the handler, styles, and render function
export let it = register('Example')

// handler to be attached to elements with class=${it}
export let handler={
  init(){
    // select greeting element
    this.greeting = this.$('.'+it.greeting)
  }
  onClick(){
    // toggle 'active' class
    this.greeting.classList.toggle('active')
  }
}

// on server, returns string. on browser, returns HTML fragment
export default ({ name }) =>html`
  <div class=${it}>
    <span class=${it.greeting}>
      Hello ${name}
    </span>
  </div>
`

// added to aggregate stylesheet for SSR
export let style = () => css`
  .${it}{
    border: 1px dashed #c89;
    padding: 1rem;
    text-align: center;
  }
  .${it.greeting}{
    font-size: 2rem;
    color: #412;
  }
  .${it.greeting}.active{
    color: #179;
  }
`

```

## Getting Started

- Get VSCode Extensions for syntax highlighting [TODO]
- Clone example repo [TODO]
- Follow tutorial [TODO]

## How it Works

TODO

## Acknowledgements

Heavily inspired by [@WebReflection's](https://github.com/WebReflection) libraries. `augm-it` uses [`uhtml`](https://github.com/WebReflection/uhtml) for browser-side rendering and [`wicked-elements`](https://github.com/WebReflection/wicked-elements) for attaching handlers.

DevX inspired by [`svelte`](https://svelte.dev/)