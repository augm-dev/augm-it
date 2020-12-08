export { html, svg } from 'https://cdn.skypack.dev/pin/uhtml@v2.1.4-wM6ggHQjDElP2aFFipzg/min/uhtml.js';

function raw(str){
  str = Array.isArray(str) ? plain.apply(null, arguments) : str;
  var template = document.createElement('template');
  template.innerHTML = str;
  return template.content;
}
let css=x=>x;

export { css, raw };
