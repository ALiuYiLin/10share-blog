import { MarkdownItAsync } from "markdown-it-async";

import { codeGroupPlugin, codeWrapperPlugin, highlightCode } from "../plugins";
const codeCopyButtonTitle = "Copy Code";
const hasSingleTheme = "";


export async function createMarkdownInstance() {
  let mdInstance: MarkdownItAsync | null = null;
  if (!mdInstance) {
    const md = new MarkdownItAsync({
      html: true,
    });
    md.use(highlightCode);
    md.use(codeWrapperPlugin, { codeCopyButtonTitle, hasSingleTheme });
    md.use(codeGroupPlugin, { codeCopyButtonTitle, hasSingleTheme });
    mdInstance = md;
  }
  return mdInstance;
}
