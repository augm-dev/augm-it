import { mkdir } from 'mk-dirs/sync'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'

const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)

function cwdify(p){
  return path.join(process.cwd(), p.replace(process.cwd(),""))
}

export async function readFile(p, encoding){
  return await readFileAsync(cwdify(p), encoding)
}

export async function writeFile(p, data){
  // only if data is truthy
  if(data){
    p = cwdify(p)
    // ensure dir exists
    mkdir(path.dirname(p))
    await writeFileAsync(p, data)
  }
}

const script_cache = umap(new Map)

// type: string of filename (with no extension) [ options in /builder/templates ]
export function getScript(type='ssr', { strategy, minified }){
  let folder = strategy === 'local' ? '' : strategy + '/'
  let ext = min ? '.min.js' : '.js'
  let p = path.join(__dirname, '../runtimes', folder+type+ext)
  return script_cache.get(p) || script_cache.set(p, fs.readFileSync(p, 'utf8'))
}