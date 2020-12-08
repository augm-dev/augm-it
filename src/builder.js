require = require("esm")(module)
var path = require('path')
var jeye = require('jeye')
const { writeFile, readFile, bytesize } = require('./utils')
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
    await Promise.all([
      ...Object.keys(targets).map(async p => {
        await this.single(p, targets[p])
      }),
      this.aggregate(targets, Object.keys(targets))
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
    this.write(output)
  }

  async aggregate(targets, changed){
    let output = await aggregate.call(printer,targets,changed)
    printer.success(`Built ${Object.keys(output).length + this.affectedFiles} files in ${Date.now() - this.loadStart}ms`)
    this.write(output)
    this.affectedFiles = 0
  }

  async unlink(p, info){
    
  }

  benchmarks(arr){
    if(!this.silent){
      if(arr.length){
        console.log(dim("║"))
      }
      arr.forEach(({ label, content }, i) => {
        console.log(`${i === arr.length - 1 ? dim("╚══") : dim("╟══")} ${label} ${dim("═▷")}  ${content}`)
      });
    }
  }


}