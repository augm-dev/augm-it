import { defineAsync } from 'https://cdn.skypack.dev/pin/wicked-elements@v3.1.1-3WdNCf0JTLfWoHQZJnW2/min/wicked-elements.js';

let definitions = __handlers__;

Object.keys(definitions).forEach(it =>
  defineAsync(`.${it},${it},[is="${it}"]`, () => 
    import(definitions[it])
  )
);
