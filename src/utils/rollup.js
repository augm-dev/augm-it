import { minJS } from './minify';
import path from 'path'

const rollupStream = require('@rollup/stream');
const virtual = require('@rollup/plugin-virtual');

export function virtual_script(runtime_type, cb){
  return function(options){
    return async function(p, info){
      return await compile(info, cb(info), getScript(runtime_type, options), options)
    }
  }
}


async function compile({id, contents}, entry, runtime, options){
  let unminified = await new Promise((res, rej) => {
    const stream = rollupStream({
      input: 'entry',
      output: { format: 'esm' },
      cache: false,
      onwarn(){},
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      },
      plugins: [
        virtual({
          entry,
          '@component': contents.toString('utf8'),
          'augm-it': runtime
        }),
        component_render_import(id)
      ]
    })
    let bundle = ''
    stream.on('data', data=>(bundle = bundle+data))
    stream.on('end', () => res(bundle))
  })
  return options.minified ? (await minJS(unminified)) : unminified
}

function is_component(id,dep){
  id = path.normalize(id)
  dep = path.normalize(dep)
  let { length } = path.join(id,dep).split('/').filter(s=>s.length)
  return length > 1
}

const component_render_import = (id) => ({
  async resolveId(dependency){
    if(dependency.startsWith('.')){
      // if this relative import is still inside the component directory
      // aka - if this import is also a component
      // import the /render.js file
      if(is_component(id, dependency)){
        // remove .js at end if it exists
        if(dependency.endsWith('.js')){
          dependency = dependency.substring(0,dependency.length-3)
        }
        dependency = dependency + '/render.js'
      }

      // we need to add one layer of depth since it's placed inside of a folder
      if(dependency.startsWith('./')){
        dependency = '.'+dependency
      } else if(dependency.startsWith('../')){
        dependency = '../'+dependency
      }
      return {
        id: dependency,
        external: true
      }
    }
  }
})