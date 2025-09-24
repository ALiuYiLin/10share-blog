import { createVNode, render } from "vue"
import { WithScoped } from "./scope"
import { styleInject } from "../browser"

export async function componentMount(el:HTMLElement,code:string,cssString:string){
  const dataUrl = "data:text/javascript;base64," + btoa(code)

  /* vite-skip-analysis */
  const MainVue = await (await import(/* @vite-ignore */dataUrl)).default

  const container = document.createElement('div')
  container.className = 'vp-doc'
  const vNode = createVNode(MainVue,{})
  
  render(vNode,container)

  WithScoped(vNode)

  el.innerHTML = ''
  el.appendChild(container)
  styleInject(cssString)
}