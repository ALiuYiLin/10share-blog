import MarkdownIt from "markdown-it";
import container from "markdown-it-container";
import type { RenderRule } from "markdown-it/lib/renderer.mjs";
import { extractTitle, getAdaptiveThemeMarker, Options } from "./utils";

type ContainerArgs = [typeof container, string, { render: RenderRule }];

export function codeGroupPlugin(
  md: MarkdownIt,
  options: Options
): ContainerArgs {
  return [
    container,
    "code-group",
    {
      render(tokens, idx) {
        if (tokens[idx].nesting === 1) {
          let tabs = "";
          let checked = "checked";

          for (
            let i = idx + 1;
            !(
              tokens[i].nesting === -1 &&
              tokens[i].type === "container_code-group_close"
            );
            ++i
          ) {
            const isHtml = tokens[i].type === "html_block";

            if (
              (tokens[i].type === "fence" && tokens[i].tag === "code") ||
              isHtml
            ) {
              const title = extractTitle(
                isHtml ? tokens[i].content : tokens[i].info,
                isHtml
              );

              if (title) {
                tabs += `<input type="radio" name="group-${idx}" id="tab-${i}" ${checked}><label data-title="${md.utils.escapeHtml(
                  title
                )}" for="tab-${i}">${title}</label>`;

                if (checked && !isHtml) tokens[i].info += " active";
                checked = "";
              }
            }
          }

          return `<div class="vp-code-group${getAdaptiveThemeMarker(
            options
          )}"><div class="tabs">${tabs}</div><div class="blocks">\n`;
        }
        return `</div></div>\n`;
      },
    },
  ];
}