import { minify } from 'terser'
import csso from 'csso'

export async function minJS(source){
  return (await minify(unminified)).code
}

export function minCSS(source){
  return csso.minify(source).css
}