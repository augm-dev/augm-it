import { single } from './single'
import { aggregate } from './aggregate'
import { parallelBuilders } from '../utils'
import path from 'path'

// TODO: use window.matchMedia() and add 'query' to style object in config

export function generateBuilders({ output }){
  return {
    single: parallelBuilders(({ id }) => 
      Object.assign(...output.map(strategy => {
        let out = (s) => path.join(strategy.destination, '/'+id.substr(0,id.length - 3)+'/'+s)
        return {
          [out("style.css")]: single.style(strategy),
          [out("node.js")]: single.node(strategy),
          [out("render.js")]: single.render(strategy),
          [out("handlers.js")]: single.handlers(strategy),
          [out("standalone.js")]: single.standalone(strategy),
          [out("saturation.js")]: single.saturation(strategy)
        }
      }))
    ),
    aggregate: parallelBuilders(() =>
      Object.assign(
        // Generate a saturation script for each "strategy" in config
        ...output.map(strategy => ({
          [path.join(strategy.destination, '/saturation.js')]: aggregate.saturation(strategy),
          [path.join(strategy.destination, '/styles.css')]: aggregate.style(strategy)
        }))
      )
    )
  }
}