import MarkdownIt from "markdown-it"
import container from 'markdown-it-container'
import type { RenderRule } from 'markdown-it/lib/renderer.mjs'

export interface Options {
  codeCopyButtonTitle: string
  hasSingleTheme: boolean
}

function extractLang(info: string) {
  return info
    .trim()
    .replace(/=(\d*)/, '')
    .replace(/:(no-)?line-numbers({| |$|=\d*).*/, '')
    .replace(/(-vue|{| ).*$/, '')
    .replace(/^vue-html$/, 'template')
    .replace(/^ansi$/, '')
}

export function extractTitle(info: string, html = false) {
  if (html) {
    return (
      info.replace(/<!--[^]*?-->/g, '').match(/data-title="(.*?)"/)?.[1] || ''
    )
  }
  return info.match(/\[(.*)\]/)?.[1] || extractLang(info) || 'txt'
}


export function codeWrapperPlugin(md: MarkdownIt, options: Options) {
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]

    // remove title from info
    token.info = token.info.replace(/\[.*\]/, '')

    const active = / active( |$)/.test(token.info) ? ' active' : ''
    token.info = token.info.replace(/ active$/, '').replace(/ active /, ' ')

    const lang = extractLang(token.info)

    return (
      `<div class="language-${lang}${getAdaptiveThemeMarker(options)}${active}">` +
      `<button title="${options.codeCopyButtonTitle}" class="copy"></button>` +
      `<span class="lang">${lang}</span>` +
      fence(...args) +
      '</div>'
    )
  }
}

export function getAdaptiveThemeMarker(options: Options) {
  return options.hasSingleTheme ? '' : ' vp-adaptive-theme'
}

type ContainerArgs = [typeof container, string, { render: RenderRule }]

export function createCodeGroup(md: MarkdownIt,options: Options,): ContainerArgs {
  return [
    container,
    'code-group',
    {
      render(tokens, idx) {
        if (tokens[idx].nesting === 1) {
          let tabs = ''
          let checked = 'checked'

          for (
            let i = idx + 1;
            !(
              tokens[i].nesting === -1 &&
              tokens[i].type === 'container_code-group_close'
            );
            ++i
          ) {
            const isHtml = tokens[i].type === 'html_block'

            if (
              (tokens[i].type === 'fence' && tokens[i].tag === 'code') ||
              isHtml
            ) {
              const title = extractTitle(
                isHtml ? tokens[i].content : tokens[i].info,
                isHtml
              )

              if (title) {
                tabs += `<input type="radio" name="group-${idx}" id="tab-${i}" ${checked}><label data-title="${md.utils.escapeHtml(title)}" for="tab-${i}">${title}</label>`

                if (checked && !isHtml) tokens[i].info += ' active'
                checked = ''
              }
            }
          }

          return `<div class="vp-code-group${getAdaptiveThemeMarker(options)}"><div class="tabs">${tabs}</div><div class="blocks">\n`
        }
        return `</div></div>\n`
      }
    }
  ]
}