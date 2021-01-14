import path from 'path'
import { watches, scan } from 'watches'
import { writeFile, bytesize, brotli, parallelBuilders, printer } from './utils'
import { generateBuilders } from './builders'
import { normalizeConfig } from './config'

let watches_options = { ignore: /(^|[\/\\])[\._]./ }


export class Builder{
  constructor(config){
    this.config = normalizeConfig(config)
    this.single = this.single.bind(this)
    this.aggregate = this.aggregate.bind(this)
    this.unlink = this.unlink.bind(this)
    this.builders = generateBuilders(this.config)
  }

  watch(){
    this.build()
    watches(this.config.input, require.cache, watches_options)
      .on("change", this.single)
      .on("aggregate", this.aggregate)
      .on("unlink", this.unlink)
      .on("error", this.error)
  }

  async build(){
    this.affectedFiles = 0
    let targets = await scan(this.config.input, watches_options)
    this.loadStart = Date.now()
    await Promise.all(
      Object.keys(targets).map(async p => {
        await this.single(targets[p])
      })
    )
    let output = await this.aggregate(targets, Object.keys(targets), true)

    printer.success(`Built ${Object.keys(targets).length} components in ${Date.now() - this.loadStart}ms`)
    // printer.benchmarks([
    //   ['styles.css', brotli(output['styles.css'])+" (brotli)" ],
    //   ['saturation.js', brotli(output['saturation.js'])+" (brotli)" ]
    // ])

  }

  async write(output={}){
    await Promise.all(
      Object.keys(output).map(k => writeFile(k, output[k]))
    )
  }

  async single(info){
    this.loadStart = Date.now()
    let output = await this.builders.single(info)
    await this.write(output)
    this.affectedFiles+=Object.keys(output).length
    this.affectedComponents++
  }

  async aggregate(targets, changed, print_benchmarks=false){
    let output = await this.builders.aggregate(targets,changed)
    await this.write(output)
    if(this.affectedComponents){
      printer.success(`Built ${this.affectedComponents} component${this.affectedComponents === 1 ? '' : 's'} in ${Date.now() - this.loadStart}ms`)
    }
    this.affectedFiles = 0
    this.affectedComponents = 0
    return output;
  }

  async unlink(p, info){
    
  }
}