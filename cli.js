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
.action((source, destination, opts) => {
  if(opts.watch){
    watch(source, destination)
  } else {
    build(source, destination)
  }
})
.parse(process.argv);
