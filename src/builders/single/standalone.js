var { skypin } = require('rollup-plugin-skypin');
const { pathDepth, compile, component_render_import, readFile } = require('../../utils');
var path = require('path')
const { minify } = require('terser')

let runtime = void 0

let default_options = {}

export function singleStandalone(options={}){
  options = { ...default_options, ...options }
  return async function(p, { contents, exports, id }){
    if(!runtime){
      runtime = await readFile(path.join(__dirname, '../../runtimes/skypin/standalone.js'), 'utf8')
    }
    let code = void 0
    exports = exports.filter(s => s!='default')
    let importStatement = `import render, { ${exports.join(',') }} from 'component';`
    let source = await compile(contents, {
      entry: `
        ${importStatement}
        import { html } from 'augm-it';
        ${ exports.includes('handlers') ? `
          import { define } from 'wicked-elements';
          Object.keys(handlers).forEach(k =>
            define('.'+k+','+k+',[is="'+k+'"]',handlers[k])
          )
        `:''}
        ${ exports.includes('style') ? `
          style()
        `:''}
        export default html.node\`\${render}\`;
        export {${exports.join(',')}}
      `,
      runtime: runtime,
      plugins: [
        component_render_import(id),
        skypin({  relative_external: true })
      ]
    })
    code = options.minify ? (await minify(source, { module: true })).code : source
    return code
  }
}