const Builder = require('./src/builder')
const { html, raw, svg, css } = require('uline')

function watch(source="it",destination="public/it"){
  let b = new Builder(source,destination)
  b.watch()
  return b;
}

async function build(source="it",destination="public/it"){
  let b = new Builder(source,destination)
  return await b.build()
}

const register = (name) => new Proxy({}, {
  get(_,prop){
    if(prop === 'toString' || prop===Symbol.toPrimitive){ return ()=>name }
    return name+'__'+prop
  }
});

module.exports = {watch, build, html, css, raw, svg, register}