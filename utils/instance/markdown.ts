import { MarkdownItAsync } from "markdown-it-async";

import { fromAsyncCodeToHtml } from "@shikijs/markdown-it/async";
import {
  bundledLanguages,
  bundledThemes,
  codeToHtml,
  createHighlighter,
} from "shiki"; // Or your custom shorthand bundle

import { codeWrapperPlugin } from "../plugins";
const codeCopyButtonTitle = "Copy Code";
const hasSingleTheme = "";

export async function createMarkdownInstance() {
  let mdInstance = null;
  if (!mdInstance) {
    async function createHighlight(str: string, lang: string) {
      const highlight = await createHighlighter({
        themes: ["github-light", "github-dark"],
        langs: Object.keys(bundledLanguages),
      });
      return highlight.codeToHtml(str, {
        theme: "github-light",
        lang,
        transformers: [
          {
            name: "vitepress:add-class",
            pre(node) {
              this.addClassToHast(node, "vp-code");
            },
          },
        ],
      });
    }

    const md = new MarkdownItAsync({
      html: true,
      linkify: true,
      highlight: (str, lang) => createHighlight(str, lang),
    });

    md.use(
      fromAsyncCodeToHtml(codeToHtml, {
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
      })
    );

    md.use(codeWrapperPlugin, { codeCopyButtonTitle, hasSingleTheme });
    mdInstance = md;
  }
  return mdInstance;
}
