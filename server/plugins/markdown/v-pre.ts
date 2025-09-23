import { MarkdwonPlugin } from '#/utils'
import { MarkdownItAsync } from 'markdown-it-async'
import container from 'markdown-it-container'
import MarkdownIt from 'markdown-it'

export function usevPreContainerPlugin(md: MarkdownIt, klass: string) {
  container(md, klass, {
    render(tokens, idx) {
      return tokens[idx].nesting === 1 ? `<div v-pre>\n` : `</div>\n`
    },
  })
}

export function vPreContainerPlugin(): MarkdwonPlugin {
  return {
    name: 'v-pre-wrapper',
    description: '避免被vue渲染',
    plugin: (md) => usevPreContainerPlugin,
    args: ['v-pre'],
  }
}
