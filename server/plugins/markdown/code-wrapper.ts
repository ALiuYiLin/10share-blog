import { MarkdownItAsync } from "markdown-it-async";
import { extractLang, getAdaptiveThemeMarker, type Options } from "./utils";
import { MarkdwonPlugin } from "#/utils";

export function useCodeWrapperPlugin(md: MarkdownItAsync, options: Options) {
  const fence = md.renderer.rules.fence!;
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args;
    const token = tokens[idx];

    // remove title from info
    token.info = token.info.replace(/\[.*\]/, "");

    const active = / active( |$)/.test(token.info) ? " active" : "";
    token.info = token.info.replace(/ active$/, "").replace(/ active /, " ");

    const lang = extractLang(token.info);
    return (
      `<div v-pre class="language-${lang}${getAdaptiveThemeMarker(
        options
      )}${active}">` +
      `<button title="${options.codeCopyButtonTitle}" class="copy"></button>` +
      `<span class="lang">${lang}</span>` +
      fence(...args) +
      "</div>"
    );
  };
}


const codeCopyButtonTitle = "Copy Code";
const hasSingleTheme = "";


export const  codeWrapperPlugin :MarkdwonPlugin ={
  name: "code-wrapper",
  description: "为代码提供显示区域，添加copy按钮",
  plugin: (md,...params)=>md.use(useCodeWrapperPlugin,...params),
  args:[{ codeCopyButtonTitle, hasSingleTheme }]
}




