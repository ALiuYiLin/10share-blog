import { codeWrapperPlugin, dangerPlugin, detailsPlugin, highlightPlugin, infoPlugin, tipPlugin, vPreContainerPlugin, warningPlugin } from "#/plugins/markdown";
import MarkdownIt, { PluginWithParams } from "markdown-it";
import { MarkdownItAsync,type PluginSimple } from "markdown-it-async";


export interface MarkdwonPlugin {
  name: string,
  description: string,
  plugin: (md: MarkdownItAsync , ...params: any[]) => void,
  args?:any[]
}


export class Markdwon {
  plugins: MarkdwonPlugin[] = []
  md: MarkdownItAsync
  constructor(){
    this.md = new MarkdownItAsync({html:true})
    this.plugins = [
      codeWrapperPlugin,
      highlightPlugin(),
      vPreContainerPlugin(),
      infoPlugin(),
      tipPlugin(),
      warningPlugin(),
      dangerPlugin(),
      detailsPlugin()
    ]
  }

  public mdUsePlugins(){
    this.plugins.forEach(p=>this.md.use(p.plugin,...(p.args ?? [])))
  }


  public render(src: string,env:any){
    return this.md.renderAsync(src,env)
  }
}