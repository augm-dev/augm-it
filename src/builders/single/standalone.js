const virtual = require('@rollup/plugin-virtual');
const rollupStream = require('@rollup/stream');
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
      runtime = await readFile(path.join(__dirname, '../../runtimes/skypin/runtime.js'), 'utf8')
    }
    let code = void 0
    if(exports.includes("handler")  && exports.includes("style")){
      let source = await compile(contents, {
        entry: `
          import render, {handler, it, style} from 'it';
          import { html } from 'augm-it'
          import { define } from 'wicked-elements'
          define('.'+it, handler);
          if(style && typeof style === 'function'){
            const styleTag = document.createElement('style');
            styleTag.type = 'text/css';
            styleTag.appendChild(document.createTextNode(style()));
            document.head.appendChild(styleTag);
          }
          export default html.node\`\${render}\`;
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