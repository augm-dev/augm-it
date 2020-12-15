require = require("esm")(module)
var fs = require('fs')
var { promisify } = require('util')
var path = require('path')
var {mkdir} = require('mk-dirs/sync')
const rollupStream = require('@rollup/stream');
var brotliSize = require('brotli-size');
const virtual = require('@rollup/plugin-virtual');

const writeFileAsync = promisify(fs.writeFile)
export const readFile = promisify(fs.readFile)
export async function writeFile(p, data){
  // only if data is truthy
  if(data){
    // ensure dir exists
    p = path.join(process.cwd(), p)
    mkdir(path.dirname(p))
    await writeFileAsync(p, data)
  }
}

export function parallelBuilders(buildGenerator){
  let self = this
  return async function(){
    let promiseObj = {}
    let builds = buildGenerator.apply(self,arguments)
    let output_paths = Object.keys(builds)
    let data_promises = output_paths.map(p => {
      return builds[p].apply(self,arguments)
    })
    let results = await Promise.all(data_promises)
    return results.reduce((output, data, index) => {
      output[output_paths[index]] = data
      return output;
    }, {})
  }  
}

/**
 * Get relative depth to access root directory
 * /some --> ./
 * /some/path --> ../
 * /some/path/deep --> ../../
 */
export function pathDepth(id){
  let chunks = id.split('/').filter(s=>s.length)
  return chunks.length === 1
    ? './'
    : chunks.slice(1).reduce((acc) => acc + '../')
}

export function compile(contents, { entry, runtime, plugins }){
  return new Promise((res, rej) => {
   const stream = rollupStream({
     input: 'entry',
     output: { format: 'esm' },
     cache: false,
     onwarn: ()=>{},
     treeshake: {
       moduleSideEffects: false,
       propertyReadSideEffects: false,
       unknownGlobalSideEffects: false
     },
     plugins: [
       virtual({
         entry,
         component: contents.toString('utf8'),
         'augm-it': runtime
       }),
       ...plugins
     ]
   })
   let bundle = ''
   stream.on('data', data=>(bundle = bundle+data))
   stream.on('end', () => res(bundle))
 })
}

function it_import(id,dep){
  id = path.normalize(id)
  dep = path.normalize(dep)
  let { length } = path.join(id,dep).split('/').filter(s=>s.length)
  return length > 1
}

export const component_render_import = (id) => ({
  async resolveId(dependency){
    if(dependency.startsWith('.')){
      // if this relative import is still inside the component directory
      // aka - if this import is also a component
      // import the /render.js file
      if(it_import(id, dependency)){
        // remove .js at end if it exists
        if(dependency.endsWith('.js')){
          dependency = dependency.substring(0,dependency.length-3)
        }
        dependency = dependency + '/render.js'
      }
      return {
        id: dependency,
        external: true
      }
    }
  }
})

export function bytesize(content){
  return formatBytes(Buffer.byteLength(content))
}

export function brotli(content){
  return formatBytes(brotliSize.sync(content))
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// From https://github.com/WebReflection/stringified-handler/blob/master/esm/index.js
/*! (c) Andrea Giammarchi - ISC */

const {isArray} = Array;
const {stringify} = JSON;
const {defineProperty, getOwnPropertyDescriptor, keys} = Object;

export const parseObject = (handler) => (
  '{' + keys(handler).map(key => {
    const {get, set, value} = getOwnPropertyDescriptor(handler, key);
    if (get && set)
      key = get + ',' + set;
    else if (get)
      key = '' + get;
    else if (set)
      key = '' + set;
    else
      key = stringify(key) + ':' + parseValue(value, key);
    return key;
  }).join(',') + '}'
);

const parseValue = (value, key) => {
  const type = typeof value;
  if (type === 'function')
    return value.toString().replace(
      new RegExp('^(\\*|async )?\\s*' + key + '[^(]*?\\('),
      (_, $1) => $1 === '*' ? 'function* (' : (($1 || '') + 'function (')
    );
  if (type === 'object' && value)
    return isArray(value) ?
            parseArray(value) :
            parseObject(value);
  return stringify(value);
};

const parseArray = array => ('[' + array.map(parseValue).join(',') + ']');