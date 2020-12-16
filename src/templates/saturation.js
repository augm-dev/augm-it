import { define, defineAsync, upgrade } from 'wicked-elements'

let definitions = __handlers__

Object.keys(definitions).forEach(it =>
  defineAsync(`.${it},${it},[is="${it}"]`, () => 
    import(definitions[it])
  )
)