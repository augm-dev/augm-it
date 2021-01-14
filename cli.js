#!/usr/bin/env node

require = require("esm")(module)
const sade = require('sade');
const pkg = require('./package.json')
const path = require('path')
const { watch, build } = require('./builder');
const { printer } = require('./builder/utils');

sade('augmit', true)
.version(pkg.version)
.describe(pkg.description)
.example('-c it.config.js -w')
.option('-w, --watch', 'Watch source directory and rebuild on changes')
.option('-c, --config', 'Path to config file', 'it.config.js')
.action(({ w, c }) => {
  let config
  try{
    config = require(path.join(process.cwd(), c))
  } catch(e){
    printer.error('Error loading config file: ' + c)
  }
  if(config && config.default && typeof config.default === 'object'){
    if(w){
      watch(config.default)
    } else {
      build(config.default)
    }
  } else {
    printer.error('Config file must export an object as default')
  }
})
.parse(process.argv);
