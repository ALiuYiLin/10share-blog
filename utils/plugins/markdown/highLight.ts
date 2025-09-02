import {
  fromAsyncCodeToHtml,
  MarkdownItShikiSetupOptions,
} from "@shikijs/markdown-it/async";
import MarkdownIt from "markdown-it";
import { codeToHtml } from "shiki"; // Or your custom shorthand bundle
const options: MarkdownItShikiSetupOptions = {
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

export function highlightCode(md: MarkdownIt) {
  return fromAsyncCodeToHtml((code, options) => {
    return codeToHtml(code, options);
  }, options);
}
