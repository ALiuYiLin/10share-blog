import { MarkdownItAsync } from "markdown-it-async";
import { codeWrapperPlugin } from "./codeWrapper";
import { codeGroupPlugin } from "./codeGroup";
import { customContainerPlugin } from "./customContainer";

import { codeToHtml } from 'shiki' // Or your custom shorthand bundle
import { markdownItShikiSetupOptions } from "./highLight";
import { fromAsyncCodeToHtml } from "@shikijs/markdown-it/async";
import { sfcPlugin } from '@mdit-vue/plugin-sfc'
import { componentPlugin } from '@mdit-vue/plugin-component';
import { vPreContainerPlugin } from "./v-pre";

const codeCopyButtonTitle = "Copy Code";
const hasSingleTheme = "";


export function mdUsePlugins(md: MarkdownItAsync) {
  md.use(fromAsyncCodeToHtml(codeToHtml, markdownItShikiSetupOptions));
  md.use(codeWrapperPlugin, { codeCopyButtonTitle, hasSingleTheme });
  md.use(codeGroupPlugin, { codeCopyButtonTitle, hasSingleTheme });
  md.use(sfcPlugin);
  md.use(componentPlugin);
  md.use(vPreContainerPlugin,'v-pre');
  md.use(customContainerPlugin,'info','INFO');
  md.use(customContainerPlugin,'tip','TIP');
  md.use(customContainerPlugin,'warning','WARNING');
  md.use(customContainerPlugin,'danger','DANGER');
  md.use(customContainerPlugin,'details','Details');
}


export * from "./codeWrapper";
export * from "./codeGroup";
export * from "./highLight";
