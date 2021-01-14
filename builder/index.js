require = require("esm")(module)

const { Builder } = require('./Builder')

module.exports = {
  watch: function(config){
    let b = new Builder(config)
    b.watch()
  },
  build: async function(config){
    let b = new Builder(config)
    return await b.build()
  }
}