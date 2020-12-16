var { skypin } = require('rollup-plugin-skypin');
const { pathDepth, compile, readFile, component_render_import } = require('../../utils');
var path = require('path')
const { minify } = require('terser')

let runtime = void 0

let default_options = {}

export function singleRender(options={}){
  options = { ...default_options, ...options }
  return async function(p, { contents, exports, id }){
    if(!runtime){
      runtime = await readFile(path.join(__dirname, '../../runtimes/skypin/runtime.js'), 'utf8')
    }
    let code = void 0
    if(exports.includes("default")){
      let source = await compile(contents, {
        entry: `
          export { default } from 'component'
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