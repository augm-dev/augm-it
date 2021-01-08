const Builder = require('./src/builder')
const { html, raw, svg, css } = require('uline')
const { classify, mangle, uid } = require('it-helpers')

let options_defaults = {
  strategy: 'all' // 'skypack', 'unpkg', 'local'
}

function watch(source="it",destination="public/it", options){
  options = { ...options_defaults, ...options }
  let b = new Builder(source,destination,options)
  b.watch()
  return b;
}

async function build(source="it",destination="public/it", options){
  options = { ...options_defaults, ...options }
  let b = new Builder(source,destination,options)
  return await b.build()
}

module.exports = {watch, build, html, css, raw, svg, classify, mangle, uid}