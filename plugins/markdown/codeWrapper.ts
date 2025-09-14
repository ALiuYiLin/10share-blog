import MarkdownIt from "markdown-it";
import { extractLang, getAdaptiveThemeMarker, type Options } from "./utils";



export function codeWrapperPlugin(md: MarkdownIt, options: Options) {
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
      `<div class="language-${lang}${getAdaptiveThemeMarker(
        options
      )}${active}">` +
      `<button title="${options.codeCopyButtonTitle}" class="copy"></button>` +
      `<span class="lang">${lang}</span>` +
      fence(...args) +
      "</div>"
    );
  };
}




