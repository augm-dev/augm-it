export { html, svg } from 'https://cdn.skypack.dev/pin/uhtml@v2.1.4-HrJRPrL0JyWkz67wcXkc/min/uhtml.js';

function raw(str){
  str = Array.isArray(str) ? plain.apply(null, arguments) : str;
  var template = document.createElement('template');
  template.innerHTML = str;
  return template.content;
}
let css=x=>x;
const register = (name) => new Proxy({}, {
  get(_,prop){
    if(prop === 'toString' || prop===Symbol.toPrimitive){ return ()=>name }
    return name+'__'+prop
  }
});

export { css, raw, register };
