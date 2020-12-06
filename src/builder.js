var path = require('path')
var jeye = require('jeye')
require = require("esm")(module)
var { generateStyles } = require('./builders/aggregate/style')
var { generateRuntime } = require('./builders/aggregate/runtime')
var { generateRender } = require('./builders/single/render')
var { generateStyle } = require('./builders/single/style')
const { writeFile, readFile, bytesize } = require('./utils')
var kleur = require('kleur')
const { bold, dim, green, cyan, blue, underline, yellow } = kleur
const { generateHandler } = require('./builders/single/handler')


// TODO: different runtimes for each build type

let jeye_options = { ignore: /(^|[\/\\])[\._]./, cache: require.cache }

module.exports = class Builder{
  constructor(source, output, debug){
    this.source = source
    this.output = output;
    this.minify = !debug;
  }

  watch(){
    this.build()
    jeye.watch(this.source, jeye_options)
      .on("change", async (p, info, changed) => {
        this.loadStart = Date.now()
        await this.single(p, info)
      })
      .on("aggregate", async (targets, changed) => {
        await this.aggregate(targets, changed)
      })
  }

  async write(id, data){
    await writeFile(path.join(this.output, id), data)
  }

  async single(p, info){
    let [ render, style, handler ] = await Promise.all([
      generateRender(p, info),
      generateStyle(p, info),
      generateHandler(p, info)
    ])
    await Promise.all([
      this.write(info.id, render),
      this.write(info.id.replace('.js','/render.js'), render),
      this.write(info.id.replace('.js','/style.css'), style),
      this.write(info.id.replace('.js','/handler.js'), handler)
    ])

  }

  print(message, color="blue"){
    if(!this.silent){ //ᕳXᕲ
      console.log(`${kleur[color](`လ  ${bold("it")}`)} ${dim(':')} ${message}`)
    }
  }
  benchmarks(arr){
    if(!this.silent){ //ᕳXᕲ
      if(arr.length){
        console.log(dim("║"))
      }
      arr.forEach(({ label, content }, i) => {
        console.log(`${i === arr.length - 1 ? dim("╚══") : dim("╟══")} ${label} ${dim("═▷")}  ${content}`)
      });
    }
  }
  tip(message){
    if(!this.silent){
      // console.log(yellow("║"))
      console.log(`${yellow("╚═▷")}  ${message}`)
    }
  }

  async aggregate(targets, changed, optimized=false, expanded=false){
    
    let [ styles, runtime ] = await Promise.all([
      generateStyles(targets),
      generateRuntime(targets)
    ])
    await Promise.all([
      this.write('styles.css', styles),
      this.write('runtime.js', runtime)
    ])

    let num_changed= Object.keys(changed).length
    let message = `Built ${bold(num_changed)} component${num_changed === 1 ? '' :  's'} in ${green(Date.now() - this.loadStart + 'ms')}`

    if(expanded){
      this.print(message)
      this.benchmarks([
        { label: "runtime.js", content: cyan(bytesize(runtime)) },
        { label: "styles.css", content: cyan(bytesize(styles)) }
      ])
    } else {
      this.print(message, 'green')
      // this.print('/it/Button.js does not have an "it" export', 'yellow')
      // this.tip(`Read more at ${underline("augm.it/docs/missing-it-export")}`)
    }


  }

  async build(){
    let targets = await jeye.targets(this.source, jeye_options)
    this.loadStart = Date.now()
    await Promise.all([
      ...Object.keys(targets).map(async p => {
        await this.single(p, targets[p])
      }),
      this.aggregate(targets, Object.keys(targets), true, true)
    ])
  }

}