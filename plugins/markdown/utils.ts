export function extractLang(info: string) {
  return info
    .trim()
    .replace(/=(\d*)/, "")
    .replace(/:(no-)?line-numbers({| |$|=\d*).*/, "")
    .replace(/(-vue|{| ).*$/, "")
    .replace(/^vue-html$/, "template")
    .replace(/^ansi$/, "");
}

export function extractTitle(info: string, html = false) {
  if (html) {
    return (
      info.replace(/<!--[^]*?-->/g, "").match(/data-title="(.*?)"/)?.[1] || ""
    );
  }
  return info.match(/\[(.*)\]/)?.[1] || extractLang(info) || "txt";
}


export function getAdaptiveThemeMarker(options: Options) {
  return options.hasSingleTheme ? "" : " vp-adaptive-theme";
}

export interface Options {
  codeCopyButtonTitle: string;
  hasSingleTheme: boolean;
}