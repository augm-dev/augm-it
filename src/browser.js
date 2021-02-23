function plain(t) {
  if(typeof t === 'string'){
    return t;
  }
  for (var s = t[0], i = 1, l = arguments.length; i < l; i++)
    s += arguments[i] + t[i];
  return s;
};
export const css=plain.bind(null);
export const raw=plain.bind(null);
export { html, svg, render } from 'uhtml'
export { classify, unique, uid } from './utils.ts'