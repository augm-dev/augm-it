const virtual = require('@rollup/plugin-virtual');
const rollupStream = require('@rollup/stream');
var { skypin } = require('rollup-plugin-skypin');
const { pathDepth, rollup, readFile, compile, component_render_import } = require('../../utils');
var path = require('path')
const { minify } = require('terser')

let runtime = void 0

let default_options = {}

export function singleHandler(options={}){
  options = { ...default_options, ...options }
  return async function(p, { contents, exports, id }){
    if(!runtime){
      runtime = await readFile(path.join(__dirname, '../../runtimes/skypin/runtime.js'), 'utf8')
    }
    let code = void 0
    if(exports.includes("handler")){
      let source = await compile(contents, {
        entry: `
          import {handler} from 'component';
          export default {
            $(x){ return this.element.querySelector(""+x) },
            $$(x){ return this.element.querySelectorAll(""+x) },
            ...handler
          };
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