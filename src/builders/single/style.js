var { writeFile } = require('../../utils')
var csso = require('csso')

let default_options = {
  minify: true
}

export function singleStyle(options={}){
  let { minify } = { ...default_options, ...options }

  return async function(p, info){
    let { error } = this
    try{
      let m = require(p)
      if(m && m.style){
        let style = m.style.toString()
        return minify ? csso.minify(style).css : style
      }
    } catch(e){
      error('Error generating styles', e)
    }
  }
}