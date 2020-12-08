import { aggregateStyles } from './aggregate/styles'
import { aggregateSaturation } from './aggregate/saturation'

import { singleNode } from './single/node'
import { singleRender } from './single/render'
import { singleStyle } from './single/style'
import { singleHandler } from './single/handler'
// import { singleSaturation } from './single/saturation'

export async function single(p, info){
  let { warn, error, success } = this
  let id = info.id.replace('.js', '')
  let results = await Promise.all(
    [
      // css file
      singleStyle({
        minify: true,
        destination: `${id}/style.css`
      }),
      // export default html.node
      singleNode({
        destination: `${id}/node.js`
      }),
      // export default html
      singleRender({
        destination: `${id}/render.js`
      }),
      // export default handler
      singleHandler({
        destination: `${id}/handler.js`
      }),
      // wicked + define(it,handler)
      // singleSaturation({
      //   destination: `${id}/saturation.js`
      // }),
      // wicked + define(it, handler) + export default html.node
      // singleStandalone({
      //   destination: `${id}/standalone.js`
      // })
    ].map(builder => builder.call({ warn, error, success}, p, info))
  )
  // merge result objects together
  return results.reduce((obj, val) => ({...obj, ...val}), {})
}

export async function aggregate(targets, changed){
  let { warn, error, success } = this
  let results = await Promise.all(
    [
      aggregateStyles({
        minify: true,
        destination: 'styles.css'
      }),
      aggregateSaturation({
        destination: 'saturation.js'
      })
    ].map(builder =>  builder.call({ warn, error, success}, targets, changed))
  )

  return results.reduce((obj, val) => ({...obj, ...val}), {})
}