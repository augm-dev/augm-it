#!/usr/bin/env node

const sade = require('sade');
const pkg = require('./package.json')
const path = require('path')
const { watch, build } = require('./index.js');

sade('augmit [source] [destination]', true)
.version(pkg.version)
.describe(pkg.description)
.example('it public/it -w')
.option('-w, --watch', 'Watch source directory and rebuild on changes')
.option('-s, --strategies', 'Strategy (local, skypack, unpkg, all) - defaults to all', 'all')
.action((source, destination, opts) => {
  let options = {
    strategy: opts.s || 'all'
  }
  if(opts.watch){
    watch(source, destination, options)
  } else {
    build(source, destination, options)
  }
})
.parse(process.argv);
