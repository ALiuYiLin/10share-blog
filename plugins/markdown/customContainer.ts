import { MarkdownEnv } from "#shared";
import MarkdownIt from "markdown-it";
import container from 'markdown-it-container'

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
 