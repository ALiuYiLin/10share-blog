import { MarkdwonPlugin } from "#/utils";
import MarkdownIt from "markdown-it";
import { MarkdownItAsync } from "markdown-it-async";
import container from 'markdown-it-container'
import { MarkdownEnv } from "shared";

export function customContainerPlugin(md:MarkdownIt,klass:string,defaultTitle:string) {
  container(md,klass,{
    render(tokens, idx, _options, env: MarkdownEnv & { references?: any }){
        const token = tokens[idx]
        const info = token.info.trim().slice(klass.length).trim()
        const attrs = md.renderer.renderAttrs(token)
        if (token.nesting === 1) {
          const title = md.renderInline(info || defaultTitle, {
            references: env.references
          })
          if (klass === 'details')
            return `<details class="${klass} custom-block"${attrs}><summary>${title}</summary>\n`
          return `<div class="${klass} custom-block"${attrs}><p class="custom-block-title">${title}</p>\n`
        } else return klass === 'details' ? `</details>\n` : `</div>\n`
      }
  })
}



export function infoPlugin():MarkdwonPlugin{
  return {
    name: "info-msg",
    description: "提示信息",
    plugin: (md,...params)=>md.use(customContainerPlugin,...params),
    args:['info','INFO']
  }
}


export function tipPlugin():MarkdwonPlugin{
  return {
    name: "tip-msg",
    description: "",
    plugin: (md,...params)=>md.use(customContainerPlugin,...params),
    args:['tip','TIP']
  }
}

export function warningPlugin():MarkdwonPlugin{
  return {
    name: "warning-msg",
    description: "警示信息",
    plugin: (md,...params)=>md.use(customContainerPlugin,...params),
    args:['warning','WARNING']
  }
}

export function dangerPlugin():MarkdwonPlugin{
  return {
    name: "danger-msg",
    description: "风险信息",
     plugin: (md,...params)=>md.use(customContainerPlugin,...params),
    args:['danger','DANGER']
  }
}

export function detailsPlugin():MarkdwonPlugin{
  return {
    name: "",
    description: "",
     plugin: (md,...params)=>md.use(customContainerPlugin,...params),
    args:['details','Details']
  }
}