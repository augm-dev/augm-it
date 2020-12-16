var { writeFile } = require('../../utils')
var csso = require('csso')
var path = require('path')

let default_options = {
  minify: true
}

export function aggregateStyles(options={}){
  options = { ...default_options, ...options }

  return async function(targets){
    let { error, warn } = this
    let styles = ""
    let data = void 0
    try{
      Object.keys(targets).forEach(p => {
        let m = require(path.join(process.cwd(),p))
        if(m && m.style){
          styles += m.style().toString() || ""
        }
      })
      data = options.minify ? csso.minify(styles).css : styles
    } catch(e){
      error('Error generating styles', e)
    }
    return data
  }
}