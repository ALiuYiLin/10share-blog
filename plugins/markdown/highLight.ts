import {
  type MarkdownItShikiSetupOptions,
} from "@shikijs/markdown-it/async";
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

