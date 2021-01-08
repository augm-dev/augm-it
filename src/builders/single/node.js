var { skypin } = require('rollup-plugin-skypin');
const { pathDepth, compile, readFile, component_render_import } = require('../../utils');
var path = require('path')
const { minify } = require('terser')

let runtime = void 0

/**
 * Ok. so. the length of the array will only be = 1 if the import is outside of the "it" source directory
 * This func will return true if the relative import is in the comopnent directory, and false if it's outside
 */

let default_options = {}

export function singleNode(options={}){
  options = { ...default_options, ...options }
  return async function(p, { contents, exports, id }){
    if(!runtime){
      runtime = await readFile(path.join(__dirname, '../../runtimes/skypin/runtime.js'), 'utf8')
    }
    let code = void 0
    if(exports.includes("default")){
      let cleaned_exports = exports.filter(e => e !== 'style' && e !== 'handlers' && e !== 'default')
      let source = await compile(contents, {
        entry: `
          import { default as it } from 'component'
          import { html } from 'augm-it'
          export default html.node\`\${it}\`
          export { ${cleaned_exports.join(',')} } from 'component'
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