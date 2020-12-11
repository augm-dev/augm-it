var { readFile, writeFile, rollup, bytesize, parseObject } = require('../../utils')
var path = require('path')
const rollupStream = require('@rollup/stream');
const virtual = require('@rollup/plugin-virtual');
import { nodeResolve } from '@rollup/plugin-node-resolve';
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
  let handlers = {}
  Object.keys(targets).forEach(p => {
    let { handler, it} = require(path.join(process.cwd(),p))
    it=`${it}`
    if(handler && it){
      handlers[it] = '.' + targets[p].id.replace('.js','/handler.js');
    }
  })
  return parseObject(handlers)
}