require = require("esm")(module)
var path = require('path')
var jeye = require('jeye')
const { writeFile, readFile, bytesize, brotli, parallelBuilders } = require('./utils')
var kleur = require('kleur')
const { bold, dim, green, cyan, blue, underline, yellow } = kleur
const { aggregateSaturation, aggregateStyles, singleNode, singleRender, singleStyle, singleHandler, singleStandalone, singleSaturation } = require('./builders/index.js')
const {printer} = require('./printer.js');


let jeye_options = { ignore: /(^|[\/\\])[\._]./, cache: require.cache }

let default_options = { strategy: 'all' }

module.exports = class Builder{
  constructor(source, destination, options){
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
    this.singleBuilder = parallelBuilders.call(printer,function(p, { id, exports }){
      let name = id.replace('.js','')
      if(exports.includes('default')){
        if((exports.includes('style') || exports.includes('handler')) && !exports.includes('it')){
          printer.warn(p + ': `it` not exported with handler/style')
        }
        return {
          [name+'/style.css']: singleStyle(),
          [name+'/node.js']: singleNode(),
          [name+'/render.js']: singleRender(),
          [name+'/handler.js']: singleHandler(),
          [name+'/standalone.js']: singleStandalone({ minify: true }),
          [name+'/saturation.js']: singleSaturation({ minify: true }),
          // [name+'/saturate.js']: singleSaturation(),
          // [name+'/standalone.js']: singleStandalone()
        }
      } else {
        printer.warn(p + ': No default export - skipping build')
        return {}
      }
    })
    
    this.aggregateBuilder = parallelBuilders.call(printer, function(targets, changed){
      return {
        'styles.css': aggregateStyles({ minify: true }),
        'saturation.js': aggregateSaturation()
      }
    })
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
    let destination = this.destination
    await Promise.all(
      Object.keys(output).map(async id => {
        await writeFile(path.join(destination, id), output[id])
      })
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