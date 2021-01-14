import { virtual_script, minCSS } from '../utils'

// TODO: standalone variant that can do saturate("my-custom-classname") 
// ~> will apply handlers and liveCSS to that classname

// TODO: total variant that has all exports (no livecss or saturation)

export let single = {
  // for returning an HTML Element to be rendered
  node: virtual_script('ssr',({ exports }) => {
    if(exports.includes('default')){
      let cleaned_exports = exports.filter(e => e !== 'style' && e !== 'handlers' && e !== 'default')
      return `
        import { default as it } from '@component'
        import { html } from 'augm-it'
        export default () => html.node\`\${it.apply(null, arguments)}\`
        export { ${cleaned_exports.join(',')} } from '@component'
      `
    }
  }),
  // for uhtml-compatible imports
  render: virtual_script('ssr',({ exports }) => {
    if(exports.includes('default')){
      let cleaned_exports = exports.filter(e => e !== 'style' && e !== 'handlers' && e !== 'default')
      return `
        export { default, ${cleaned_exports.join(',')} } from '@component'
      `
    }
  }),
  // for async wicked-elements
  handlers: virtual_script('ssr',({ exports }) => {
    if(exports.includes('handlers')){
      return `
        import {handlers} from '@component';
        export default Object.keys(handlers).reduce((o,k) => ({
          ...o,
          [k]: {
            $(x){ return this.element.querySelector(""+x) },
            $$(x){ return this.element.querySelectorAll(""+x)},
            ...handlers[k]
          }
        }),{})
      `
    }
  }),
  // hydrates all existing elements with the ssr class names
  saturation: virtual_script('ssr',({ exports }) => {
    if(exports.includes('handlers')){
      return `
        import {handlers} from '@component';
        import {define} from 'wicked-elements';
        let builtin = {
          $(x){ return this.element.querySelector(""+x) },
          $$(x){ return this.element.querySelectorAll(""+x) }
        }
        for(let k in handlers){
          define('.'+k, {
            $(x){ return this.element.querySelector(""+x) },
            $$(x){ return this.element.querySelectorAll(""+x) },
            ...handlers[k]
          })
        }
      `
    }
  }),
  // for returning a live, styled, HTML Element to external sources
  standalone: virtual_script('external',({ exports }) => {
    let named_exports = exports.filter(s => s!='default').join(',')
    return `
      import render, { ${ named_exports }} from '@component';
      import { html, liveCSS } from 'augm-it';
      ${ exports.includes('handlers') ? `
        import { define } from 'wicked-elements';
        Object.keys(handlers).forEach(k =>
          define('.'+k+','+k+',[is="'+k+'"]',handlers[k])
        )
      `:''}
      ${ exports.includes('style') ? `
        liveCSS(style())
      `:''}
      export default () => html.node\`\${render.apply(null, arguments)}\`;
      export {${ named_exports }}
    `
  }),

  // stylesheet for this component
  style: (options) => async function({ module, exports }){
    if(exports.includes('style')){
      let styleFn = module.style
      if(styleFn && typeof styleFn === 'function'){
        let unminified = styleFn(options).toString() || ""
        return options.minified ? minCSS(unminified) : unminified
      }
    }
  }
}