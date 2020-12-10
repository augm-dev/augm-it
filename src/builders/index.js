import { aggregateStyles } from './aggregate/styles'
import { aggregateSaturation } from './aggregate/saturation'

import { singleNode } from './single/node'
import { singleRender } from './single/render'
import { singleStyle } from './single/style'
import { singleHandler } from './single/handler'
// import { singleSaturation } from './single/saturation'

function multiBuilder(builds){
  return async function(){
    let results = await Promise.all(builds.apply(this,arguments).map(builder => builder.apply(this,arguments)))
    return results.reduce((obj, val) => ({...obj, ...val}), {})
  }
}

export let single = multiBuilder((p, { id }) => {
  let name = id.replace('.js', '')
  return [
     // css file
     singleStyle({
      minify: true,
      destination: `${name}/style.css`
    }),
    // export default html.node
    singleNode({
      destination: `${name}/node.js`
    }),
    // export default html
    singleRender({
      destination: `${name}/render.js`
    }),
    // export default handler
    singleHandler({
      destination: `${name}/handler.js`
    }),
    // wicked + define(it,handler)
    // singleSaturation({
    //   destination: `${name}/saturation.js`
    // }),
    // wicked + define(it, handler) + export default html.node
    // singleStandalone({
    //   desti
  ]
})

export let aggregate = multiBuilder(() => [
  aggregateStyles({
    minify: true,
    destination: 'styles.css'
  }),
  aggregateSaturation({
    destination: 'saturation.js'
  })
])