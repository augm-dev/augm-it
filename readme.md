<div align="center">
  <img src="https://github.com/augm-dev/augm-it/raw/overhaul/meta/augm.png" alt="augm logo" width="80" />
</div>

<h1 align="center">augm-it</h1>
<h3 align="center">Lightweight components with multiple delivery strategies</h3>

<div align="center">
  <a href="https://npmjs.org/package/augm-it">
    <img src="https://badgen.now.sh/npm/v/augm-it" alt="version" />
  </a>
</div>

<h1 align="center">:construction: Under active development. Come back soon! :construction:</h1>

# Features

- Write markup (HTML), styles (CSS), and handler (JS) in a single file (modeled after `svelte`)
- Extremely lightweight
- Built on [`uhtml`](https://github.com/WebReflection/uhtml), which is a [fast](https://krausest.github.io/js-framework-benchmark/current.html) tagged-template alternative to virtual-dom architectures (`vue`,`react`,`preact`, etc...)
- Automatically generates
  - SSR-friendly scripts
    - Optimized saturation script for minimal TTI (time to interactive)
    - Load component render functions on demand
    - Bundled and optimized CSS stylesheet
  - Standalone components (for easy imports from an external script / page)
    - Automatic saturation of existing elements with matching css query (`class="SpecialButton"`)
    - Importable `(props)=>(HTML Fragment)` standalone component for scripts that handle rendering

## Usage

### CLI

TODO

### Scripts to import

TODO

### Writing Components

Components are functions that return HTML snippets. On the server, these snippets are strings. On the browser, they're specialized HTML fragments powered by [uhtml](https://github.com/WebReflection/uhtml).

Here's a very simple example:

**`Greeting.js`**
```js
import { html } from 'augm-it'

export default (name) => html`
  <h1>Hello, ${name}</h1>
`
```

**`test.js`**
```js
import Greeting from './Greeting'

Greeting("Marshall")
// ~> <h1>Hello, Marshall</h1>
```

To add styles and make our components interactive, we'll need to use the `style` and `handlers` exports.
- `style` a function that returns a CSS snippet that will style that component
- `handlers` an object with keys that correspond to class names and values that correspond to custom-element handlers for HTML nodes with that class

You can think of `handlers` and `style` as generic definitions that apply to *all* instances of the component. If we have 29 greetings on one page, there will only be one invocation of `style` and `handlers`, while the default render function will be called 29 times.

To create readable and portable class names that won't suffer from name-clashing, we'll use the `classify` function to connect the render, styles, and handlers.

```js
import { html, svg, css, classify } from 'augm-it'

// `classify` generates a proxy that outputs class names that avoid name-clashing
let Example = classify('Example')

// on server, returns string. on browser, returns HTML fragment
export default ({ name }) =>html`
  <div class=${Example}>
    <span class=${Example.greeting}>
      Hello ${name}
    </span>
  </div>
`

// custom-element-like handlers to be attached to elements with corresponding classes
export let handlers={
  [Example]: {
    init(){
      console.log("Example is live!")
    }
  },
  [Example.greeting]: {
    onClick(){
      console.log("The greeting was clicked!")
      this.element.classList.toggle('active')
    }
  }
}

// added to aggregate stylesheet for SSR
export let style = () => css`
  .${Example}{
    border: 1px dashed #c89;
    padding: 1rem;
    text-align: center;
  }
  .${Example.greeting}{
    font-size: 2rem;
    color: #412;
  }
  .${Example.greeting}.active{
    color: #179;
  }
`

```

## Getting Started

- Get VSCode Extensions for syntax highlighting:
  - [`literally-html`](https://marketplace.visualstudio.com/items?itemName=webreflection.literally-html): Syntax highlighting for html inside of JS tagged template strings
  - [`vscode-styled-componets`](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components): Offers CSS syntax highlighting and code completion inside css tagged template strings

## How it Works

TODO

## Acknowledgements

Heavily inspired by [@WebReflection's](https://github.com/WebReflection) libraries. `augm-it` uses [`uhtml`](https://github.com/WebReflection/uhtml) for browser-side rendering and [`wicked-elements`](https://github.com/WebReflection/wicked-elements) for attaching handlers.

DevX inspired by [`svelte`](https://svelte.dev/)