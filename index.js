const { html, raw, svg, css } = require('uline')
const { classify, mangle, uid } = require('it-helpers')
const render = x=>x

module.exports = {html, css, raw, svg, classify, mangle, uid, render}