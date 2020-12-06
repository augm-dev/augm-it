import { aggregateStyles } from './aggregate/styles'
import { aggregateSaturation } from './aggregate/saturation'

import { singleNode } from './single/node'
import { singleRender } from './single/render'
import { singleStyle } from './single/style'
import { singleHandler } from './single/handler'
import { singleSaturation } from './single/saturation'

export async function single(p, info){
  let { warn, error, success } = this
  let results = await Promise.all(
    [
      // css file
      singleStyle({
        minify: true,
        output: `${id}/style.css`
      }),
      // export default html.node
      singleNode({
        output: `${id}/node.js`
      }),
      // export default html
      singleRender({
        output: `${id}/render.js`
      }),
      // export default handler
      singleHandler({
        output: `${id}/handler.js`
      }),
      // wicked + define(it,handler)
      singleSaturation({
        output: `${id}/saturation.js`
      }),
      // wicked + define(it, handler) + export default html.node
      singleStandalone({
        output: `${id}/standalone.js`
      })
    ].map(builder => {
      builder.call({ warn, error, success}, p, info)
    })
  )
  // merge result objects together
  return results.reduce((obj, val) => ({...obj, ...val}), {})
}

export async function aggregate(targets, changed){
  let { warn, error, success } = this
  let results = Promise.all([
    aggregateStyles({
      minify: true,
      output: 'saturation.js'
    }),
    aggregateSaturation({
      output: 'styles.css'
    })
  ].map(builder => {
    builder.call({ warn, error, success}, targets, changed)
  }))

  return results.reduce((obj, val) => ({...obj, ...val}), {})
}