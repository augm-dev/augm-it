import { minCSS, getScript, parseObject } from '../utils'

export let aggregate = {
  style: (options) => async function(targets){
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
  },
  saturation: (options) => async function(targets){
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