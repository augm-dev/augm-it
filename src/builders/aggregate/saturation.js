var { readFile, writeFile, rollup, bytesize, parseObject } = require('../../utils')
var path = require('path')
const { minify } = require('terser')

let runtime_template

let terser_options = {}
let default_options = {}

export function aggregateSaturation(options={}){
  options = { ...default_options, ...options }
  return async function(targets){
    // Load template file
    let runtime_start = Date.now()
    if(!runtime_template){
      runtime_template = await readFile(path.join(__dirname, '../../runtimes/saturation.min.js'), 'utf8')
    }
    return runtime_template.replace('__handlers__', generateHandlers(targets))
  }
}

function generateHandlers(targets){
  let all_handlers = {}
  Object.keys(targets).forEach(p => {
    let { handlers } = require(path.join(process.cwd(),p))
    if(handlers && typeof handlers === 'object'){
      Object.keys(handlers).forEach(k => {
        all_handlers[k] = '.' + targets[p].id.replace('.js', '/handlers.js');
      })
    }
  })
  return parseObject(all_handlers)
}