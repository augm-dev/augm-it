var { writeFile } = require('../../utils')
var csso = require('csso')
var path = require('path')
var { printer } = require('../../printer')

let default_options = {
  minify: true
}

export function singleStyle(options={}){
  options = { ...default_options, ...options }

  return async function(p, info){
    let data = void 0
    try{
      let m = require(path.join(process.cwd(),p))
      if(m && m.style){
        let style = m.style().toString()
        data = options.minify ? csso.minify(style).css : style
      }
    } catch(e){
      printer.error('Error generating styles', e)
    }
    return data
  }
}