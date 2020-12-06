var { writeFile } = require('../../utils')
var csso = require('csso')

let default_options = {
  minify: true
}

export function aggregateStyles(options={}){
  let { minify } = { ...default_options, ...options }

  return async function(targets){
    let { error, warn } = this
    let styles = ""
    try{
      Object.keys(targets).forEach(p => {
        let m = require(p)
        if(m && m.style){
          styles += m.style.toString() || ""
        }
      })
      return minify ? csso.minify(styles).css : styles
    } catch(e){
      error('Error generating styles', e)
    }
  }
}