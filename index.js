const Builder = require('./src/builder')

function watch(){
  let b = new Builder(source,destination)
  b.watch()
  return b;
}

async function build(source="it",destination="public/it"){
  let b = new Builder(source,destination)
  return await b.build()
}


module.exports = {watch, build}