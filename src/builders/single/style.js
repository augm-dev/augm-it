var { writeFile } = require('../../utils')
var csso = require('csso')
var path = require('path')

let default_options = {
  minify: true
}

export function singleStyle(options={}){
  let { minify, destination } = { ...default_options, ...options }

  return async function(p, info){
    let { error } = this
    let data = void 0
    try{
      let m = require(path.join(process.cwd(),p))
      if(m && m.style){
        let style = m.style.toString()
        data = minify ? csso.minify(style).css : style
      }
    } catch(e){
      error('Error generating styles', e)
    }
    return { [destination]: data }
  }
}