require = require("esm")(module)
var path = require('path')
var jeye = require('jeye')
const { writeFile, readFile, bytesize, brotli, parallelBuilders } = require('./utils')
var kleur = require('kleur')
const { bold, dim, green, cyan, blue, underline, yellow } = kleur
const { aggregateSaturation, aggregateStyles, singleNode, singleRender, singleStyle, singleHandlers, singleStandalone, singleSaturation } = require('./builders/index.js')
const {printer} = require('./printer.js');


let jeye_options = { ignore: /(^|[\/\\])[\._]./, cache: require.cache }

let default_options = {
  input: 'it',
  output: {
    'public/it': {
      minified: true,
      cdn: 'skypack'
    }
  }
}

module.exports = class Builder{
  constructor(options){
    options = { ...default_options, ...options }
    Object.assign(this, { source, destination, options })
    this.single = this.single.bind(this)
    this.aggregate = this.aggregate.bind(this)
    this.unlink = this.unlink.bind(this)
    this.createBuilders()
  }

  watch(){
    this.build()
    jeye.watch(this.source, jeye_options)
      .on("change", this.single)
      .on("aggregate", this.aggregate)
      .on("unlink", this.unlink)
    /**
     * watches.scan(this.source, { ignore: ... }) => (targets, all)
     * watches(this.source, { ignore }).on('change', ()=>{}).on('aggregate',p=>true,()=>{})
     */
  }

  createBuilders(){
    function createBuild(name,options){
      let out = (s) => path.join(options.destination, '/'+name'/'+s)
      return {
        [out("style.css")]: singleStyle(options),
        [out("node.js")]: singleNode(options),
        [out("render.js")]: singleRender(options),
        [out("handlers.js")]: singleHandlers(options),
        [out("standalone.js")]: singleStandalone(options),
        [out("saturation.js")]: singleSaturation(options)
      }
    }
    this.singleBuilder = parallelBuilders(id => 
      this.options.strategies.reduce((o,k) => ({
        ...o,
        ...createBuild(id.replace('.js',''), this.options.strategies[k])
      }))
    )
    this.aggregateBuilder = parallelBuilders(() => ({
      ...this.options.sheets.reduce((o,k) => ({ ...o,
        [k]: aggregateStyles(this.options.sheets[k])
      })),
      ...this.options.strategies.reduce((o, k) => {
        let stategy = this.options.strategies[k];
        return {
          ...o,
          [path.join(strategy.destination, '/saturation.js')]: aggregateSaturation(strategy)
        }
      })
    }))
  }

  async build(){
    this.affectedFiles = 0
    let targets = await jeye.targets(this.source, jeye_options)
    this.loadStart = Date.now()
    await Promise.all(
      Object.keys(targets).map(async p => {
        await this.single(p, targets[p])
      })
    )
    let output = await this.aggregate(targets, Object.keys(targets), true)

    printer.success(`Built ${Object.keys(targets).length} components in ${green(`${Date.now() - this.loadStart}ms`)}`)
    printer.benchmarks([
      ['styles.css', brotli(output['styles.css'])+" (brotli)" ],
      ['saturation.js', brotli(output['saturation.js'])+" (brotli)" ]
    ])

  }

  async write(output={}){
    await Promise.all(
      Object.keys(output).map(k => writeFile(k, output[k]))
    )
  }

  async single(p, info){
    this.loadStart = Date.now()
    let output = await this.singleBuilder(p,info)
    this.affectedFiles+=Object.keys(output).length
    this.affectedComponents++
    this.write(output)
  }

  async aggregate(targets, changed, print_benchmarks=false){
    let output = await this.aggregateBuilder(targets,changed)
    await this.write(output)
    if(this.affectedComponents){
      printer.success(`Built ${this.affectedComponents} component${this.affectedComponents === 1 ? '' : 's'} in ${green(`${Date.now() - this.loadStart}ms`)}`)
    }
    this.affectedFiles = 0
    this.affectedComponents = 0
    return output;
  }

  async unlink(p, info){
    
  }


}