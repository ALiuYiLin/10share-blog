export function resetScoped(el:Element,scopedId:string){
  console.log('el: ', el);
  let attrs = el.getAttributeNames().filter(p=>p.startsWith('data-v'))
  attrs.forEach(attr=>{
    el.removeAttribute(attr)
  })
  attrs.unshift(scopedId)
  attrs.forEach(attr=>{
    el.setAttribute(attr,'')
  })
}

function setScope(el: Element,scoped: string){
  el.setAttribute(scoped,'')
  el.querySelectorAll("*").forEach(subEl=>{
    subEl.setAttribute(scoped,'')
  })
}

export function WithScoped(vNode:globalThis.VNode){
  const el = vNode.el as Element
  if(typeof vNode.type === 'string'){

  }
  else{
    // @ts-ignore
    const scopedId = vNode.type.__scopeId
    if(scopedId) setScope(el,scopedId)
    
  }
  // @ts-ignore
  const subComponents:globalThis[] = vNode.component?.subTree.dynamicChildren
  if(subComponents) subComponents.forEach(c=>WithScoped(c))
}