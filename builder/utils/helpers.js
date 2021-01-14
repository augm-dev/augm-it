// FROM: () => Object of async functions 
// TO: async () => resolved object
export function parallelBuilders(buildGenerator){
  return async function(info){
    // Get object of async functions
    let builds = buildGenerator(info)
    // Convert obj to arrays of keys & promises
    let keys = Object.keys(builds)
    let value_promises = keys.map(p => {
      return builds[p](info)
    })
    // Wait until all promises have resolved
    let values = await Promise.all(value_promises)
    // Merge keys and values arrays into object
    return values.reduce((o,v,i) => ({...o,
      [keys[i]]: v
    }), {})
  }  
}

/**
 * Get relative depth to access root directory
 * /some --> ./
 * /some/path --> ../
 * /some/path/deep --> ../../
 */
export function pathDepth(id){
  let chunks = id.split('/').filter(s=>s.length)
  return chunks.length === 1
    ? './'
    : chunks.slice(1).reduce((acc) => acc + '../')
}


// From https://github.com/WebReflection/stringified-handler/blob/master/esm/index.js
/*! (c) Andrea Giammarchi - ISC */

const {isArray} = Array;
const {stringify} = JSON;
const {defineProperty, getOwnPropertyDescriptor, keys} = Object;

export const parseObject = (handler) => (
  '{' + keys(handler).map(key => {
    const {get, set, value} = getOwnPropertyDescriptor(handler, key);
    if (get && set)
      key = get + ',' + set;
    else if (get)
      key = '' + get;
    else if (set)
      key = '' + set;
    else
      key = stringify(key) + ':' + parseValue(value, key);
    return key;
  }).join(',') + '}'
);

const parseValue = (value, key) => {
  const type = typeof value;
  if (type === 'function')
    return value.toString().replace(
      new RegExp('^(\\*|async )?\\s*' + key + '[^(]*?\\('),
      (_, $1) => $1 === '*' ? 'function* (' : (($1 || '') + 'function (')
    );
  if (type === 'object' && value)
    return isArray(value) ?
            parseArray(value) :
            parseObject(value);
  return stringify(value);
};

const parseArray = array => ('[' + array.map(parseValue).join(',') + ']');