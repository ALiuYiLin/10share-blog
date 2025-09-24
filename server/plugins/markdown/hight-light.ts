import { MarkdwonPlugin } from "#/utils";
import { fromAsyncCodeToHtml, MarkdownItShikiSetupOptions } from "@shikijs/markdown-it/async";
import { codeToHtml } from 'shiki'

export const markdownItShikiSetupOptions: MarkdownItShikiSetupOptions = {
  themes: {
    light: "github-light",
    dark: "github-dark",
  },
  transformers: [
    {
      name: "vitepress:add-class",
      pre(node) {
        node.properties.style = "";
        this.addClassToHast(node, "vp-code");
      },
    },
  ],
};


export function highlightPlugin():MarkdwonPlugin{
  return {
    name:'highlight-plugin',
    description: '为代码提供高亮功能',
    plugin:fromAsyncCodeToHtml(codeToHtml,markdownItShikiSetupOptions)
  }
}