import { defineAsync } from 'wicked-elements'

let definitions = __handlers__

Object.keys(definitions).forEach(it =>
  defineAsync(`.${it},${it},[is="${it}"]`, () => 
    import(definitions[it]).then(obj => ({ default: obj.default[it] }))
  )
)