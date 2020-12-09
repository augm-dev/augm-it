import { html, svg } from 'uhtml'
function raw(str){
  str = Array.isArray(str) ? plain.apply(null, arguments) : str
  var template = document.createElement('template')
  template.innerHTML = str;
  return template.content;
}
let css=x=>x
const register = (name) => new Proxy({}, {
  get(_,prop){
    if(prop === 'toString' || prop===Symbol.toPrimitive){ return ()=>name }
    return name+'__'+prop
  }
});
// // from https://github.com/WebReflection/plain-tag/blob/master/esm/index.js
// function plain(t) {
//   for (var s = t[0], i = 1, l = arguments.length; i < l; i++)
//     s += arguments[i] + t[i];
//   return s;
// };
// let css = plain.bind(null)
export { css, html, svg, raw, register }