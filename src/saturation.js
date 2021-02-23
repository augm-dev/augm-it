import { define, defineAsync } from 'wicked-elements'

let toQuery = x => x && x[Symbol.toStringTag] === 'classified' ? '.'+x : x

 // possible: check if X is a "classify" proxy (if it is, the dot can be inferred)

const normalize=o=>Object.assign({
  $(x){ return this.element.querySelector(toQuery(x)) },
  $$(x){ return [...this.element.querySelectorAll(toQuery(x))] }
},o)

/**
 * locations = {
 *    "OceanScene__sky": "./OceanScene/handlers.js",
 *    "OceanScene__water":"./OceanScene/handlers.js",
 *    "Signature":"./Signature/handlers.js"
 * };
 */

// importfn:  x=>import(x)

export function saturateAsync(locations, importfn){
  for(let k in locations){
    defineAsync('.'+k, () => 
      importfn(locations[k]).then(mod => ({
        default: normalize(mod.handlers[k])
      }))
    )
  }
}

export function saturate(definitions){
  for(let k in definitions){
    define('.'+k, normalize(definitions[k]))
  }
}
// TODO: this is repeated
function plain(t) {
  if(typeof t === 'string'){
    return t;
  }
  for (var s = t[0], i = 1, l = arguments.length; i < l; i++)
    s += arguments[i] + t[i];
  return s;
};

export function stylize(){
  let styles = plain.apply(null,arguments)
  if(styles){
    const styleTag = document.createElement('style');
    styleTag.type = 'text/css';
    styleTag.appendChild(document.createTextNode(styles))
    return document.head.appendChild(styleTag)
  }
}