import { virtual_script, minCSS, getScript } from '../utils'

// for returning an HTML Element to be rendered
export let singleNode = virtual_script('ssr',({ exports }) => {
  if(exports.includes('default')){
    let cleaned_exports = exports.filter(e => e !== 'style' && e !== 'handlers' && e !== 'default')
    return `
      import { default as it } from '@component'
      import { html } from 'augm-it'
      export default () => html.node\`\${it.apply(null, arguments)}\`
      export { ${cleaned_exports.join(',')} } from '@component'
    `
  }
})

// for uhtml-compatible imports
export let singleRender = virtual_script('ssr',({ exports }) => {
  if(exports.includes('default')){
    let cleaned_exports = exports.filter(e => e !== 'style' && e !== 'handlers' && e !== 'default')
    return `
      export { default, ${cleaned_exports.join(',')} } from '@component'
    `
  }
})

// for async wicked-elements
export let singleHandlers = virtual_script('ssr',({ exports }) => {
  if(exports.includes('handlers')){
    return `
      import {handlers} from '@component';
      let builtin = {
        $(x){ return this.element.querySelector(""+x) },
        $$(x){ return this.element.querySelectorAll(""+x) }
      }
      export default Object.keys(handlers).reduce((o,k) => ({
        ...o,
        [k]: {
          ...builtin
          ...handlers[k]
        }
      }),{})
    `
  }
})

// hydrates all existing elements with the proper class names
export let singleSaturation = virtual_script('ssr',({ exports }) => {
  if(exports.includes('handlers')){
    return `
      import {handlers} from '@component';
      import {define} from 'wicked-elements';
      for(let k in handlers){
        define('.'+k, {
          $(x){ return this.element.querySelector(""+x) },
          $$(x){ return this.element.querySelectorAll(""+x) },
          ...handlers[key]
        })
      }
    `
  }
})

// for returning a live, styled, HTML Element
// TODO: use window.matchMedia() and add 'query' to style object in config
export let singleStandalone = virtual_script('external',({ exports }) => {
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
})

export let singleStyle = function(options){
  return async function(p, { module, exports }){
    if(exports.includes('style')){
      let styleFn = module.style
      if(styleFn && typeof styleFn === 'function'){
        let unminified = styleFn(options).toString() || ""
        return options.minified ? minCSS(unminified) : unminified
      }
    }
  }
}

export let aggregateStyles = function(options){
  return async function(targets){
    let styles = ""
    try{
      Object.keys(targets).forEach(p => {
        let { module, exports } = targets[p]
        let styleFn = module.style
        if(styleFn && typeof styleFn === 'function'){
          styles += styleFn(options).toString() || ""
        }
      })
      return options.minified ? minCSS(styles) : styles
    } catch(e){
      printer.error('Error generating aggregate styles', e)
    }
  }
}

export let aggregateSaturation = function(options){
  return async function(targets){
    let all_handlers = {}
    Object.keys(targets).forEach(p => {
      let { module, exports } = targets[p]
      if(module.handlers && typeof module.handlers === 'object'){
        Object.keys(module.handlers).forEach(k => {
          all_handlers[k] = '.' + targets[p].id.replace('.js', '/handlers.js');
        })
      }
    })
    let saturation_template = getScript('saturation', options)
    return saturation_template.replace('__handlers__', parseObject(all_handlers))
  }
}