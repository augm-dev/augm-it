require = require("esm")(module)
var path = require('path')
var jeye = require('jeye')
const { writeFile, readFile, bytesize, brotli } = require('./utils')
var kleur = require('kleur')
const { bold, dim, green, cyan, blue, underline, yellow } = kleur
const { single, aggregate } = require('./builders/index.js')

function print(message, color="blue"){
  if(!this.silent){
    console.log(`${kleur[color](`လ  ${bold("it")}`)} ${dim(':')} ${message}`)
  }
}

let printer = {
  warn(message){
    print(message, "yellow")
    // console.log(yellow("║"))
    // console.log(`${yellow("╚═▷")}  ${message}`)
  },
  error(message, e){
    print(message, "red")
    console.log(yellow(e))
  },
  success(message){
    print(message, "green")
  },
  info(message){
    print(message, "blue")
  },
  benchmarks(arr){
    if(!this.silent){
      if(arr.length){
        console.log(dim("║"))
      }
      arr.forEach(([label, ...facts], i) => {
        console.log(`${i === arr.length - 1 ? dim("╚══") : dim("╟══")} ${label} ${dim("═▷")}  ${facts.join(dim(' -- '))}`)
      });
    }
  }
}


let jeye_options = { ignore: /(^|[\/\\])[\._]./, cache: require.cache }

module.exports = class Builder{
  constructor(source, destination){
    Object.assign(this, { source, destination})
    this.single = this.single.bind(this)
    this.aggregate = this.aggregate.bind(this)
    this.unlink = this.unlink.bind(this)
  }

  watch(){
    this.build()
    jeye.watch(this.source, jeye_options)
      .on("change", this.single)
      .on("aggregate", this.aggregate)
      .on("unlink", this.unlink)
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
    let output = await single.call(printer,p,info)
    this.affectedFiles+=Object.keys(output).length
    this.affectedComponents++
    this.write(output)
  }

  async aggregate(targets, changed, print_benchmarks=false){
    let output = await aggregate.call(printer,targets,changed)
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