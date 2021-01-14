import { defineAsync } from 'https://unpkg.com/wicked-elements@3.1.1/esm/index.js?module';

let definitions = __handlers__;

Object.keys(definitions).forEach(it =>
  defineAsync(`.${it},${it},[is="${it}"]`, () => 
    import(definitions[it]).then(obj => ({ default: obj.default[it] }))
  )
);
