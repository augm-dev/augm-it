import { uid as $uid } from 'uid'

function uid(n=11):string{
  return 'u'+$uid(n-1)
}
function unique(n:string):Object{
  return classify(n+'-'+$uid(7))
}

function classify(n:string):Object{
  return new Proxy({},{
    get(_,prop){
      if(prop===Symbol.toPrimitive || prop === 'toString'){ return ()=>n }
      if(prop===Symbol.toStringTag) return 'classified'
      return classify(n+'__'+prop.toString())
    }
  })
}

export { classify, unique, uid };