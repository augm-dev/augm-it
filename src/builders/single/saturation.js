var { skypin } = require('rollup-plugin-skypin');
const { pathDepth, rollup, readFile, compile, component_render_import } = require('../../utils');
var path = require('path')
const { minify } = require('terser')

let runtime = void 0

let default_options = {}

export function singleSaturation(options={}){
  options = { ...default_options, ...options }
  return async function(p, { contents, exports, id }){
    if(!runtime){
      runtime = await readFile(path.join(__dirname, '../../runtimes/skypin/runtime.js'), 'utf8')
    }
    let code = void 0
    if(exports.includes("handlers")){
      let source = await compile(contents, {
        entry: `
          import {handlers} from 'component';
          Object.keys(handlers).forEach(k => {
            define('.'+k, {
              $(x){ return this.element.querySelector(""+x) },
              $$(x){ return this.element.querySelectorAll(""+x) },
              ...handlers[key]
            })
          })
        `,
        runtime: runtime,
        plugins: [
          component_render_import(id),
          skypin({  relative_external: true })
        ]
      })
      code = options.minify ? (await minify(source)).code : source
    }
    return code
  }
}