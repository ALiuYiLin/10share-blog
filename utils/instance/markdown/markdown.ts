import { MarkdownItAsync } from "markdown-it-async";

import {  mdUsePlugins } from "../../plugins";





export async function createMarkdownInstance() {
  let mdInstance: MarkdownItAsync | null = null;
  if (!mdInstance) {
    const md = new MarkdownItAsync({
      html: true,
    });
    mdUsePlugins(md);
    mdInstance = md;
  }
  return mdInstance;
}
  