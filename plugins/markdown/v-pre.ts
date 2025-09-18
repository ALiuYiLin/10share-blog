import MarkdownIt from "markdown-it"
import container from 'markdown-it-container'

export function vPreContainerPlugin(md:MarkdownIt,klass:string) {
  container(md,klass,{
    render(tokens, idx){
      return tokens[idx].nesting === 1 ? `<div v-pre>\n` : `</div>\n`
    }
  })
}