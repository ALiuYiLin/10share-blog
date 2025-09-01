import { MarkdownItAsync } from "markdown-it-async";

import { fromAsyncCodeToHtml } from "@shikijs/markdown-it/async";
import { codeToHtml } from "shiki"; // Or your custom shorthand bundle

import { codeWrapperPlugin, createCodeGroup } from "../plugins";
const codeCopyButtonTitle = "Copy Code";
const hasSingleTheme = "";

export async function createMarkdownInstance() {
  let mdInstance = null;
  if (!mdInstance) {
    const md = new MarkdownItAsync({
      html: true,
      // linkify: true,
    });

    md.use(
      fromAsyncCodeToHtml(
        (code, options) => {
          return codeToHtml(code, options);
        },
        {
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
          transformers: [
            {
              name: "vitepress:add-class",
              pre(node) {
                node.properties.style = ''
                this.addClassToHast(node, "vp-code");
              },
            },
          ],
        }
      )
    );
    md.use(codeWrapperPlugin, { codeCopyButtonTitle, hasSingleTheme });
    md.use(createCodeGroup, { codeCopyButtonTitle, hasSingleTheme });
    mdInstance = md;
  }
  return mdInstance;
}
