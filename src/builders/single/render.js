const virtual = require('@rollup/plugin-virtual');
const rollupStream = require('@rollup/stream');
var { skypin } = require('rollup-plugin-skypin');
const { pathDepth, rollup, readFile, component_render_import } = require('../../utils');
var path = require('path')
const { minify } = require('terser')

let runtime = void 0

let rollup_options = (component, runtime, id) => {
  return {
    input: 'virt',
    output: { format: 'esm' },
    cache: false,
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false
    },
    plugins: [
      virtual({
        virt: `export {default} from 'it'`,
        it: component,
        'augm-it': runtime
      }),
      component_render_import(id),
      skypin({  relative_external: true })
    ]
  }
}

let default_options = {}

export function singleRender(options={}){
  options = { ...default_options, ...options }
  return async function(p, { contents, exports, id }){
    if(!runtime){
      runtime = await readFile(path.join(__dirname, '../../runtimes/runtime.js'), 'utf8')
    }
    let code = void 0
    if(exports.includes("default")){
      let source = await rollup(rollup_options(contents.toString('utf8'), runtime, id))
      code = options.minify ? (await minify(source)).code : source
    }
    return code
  }
}