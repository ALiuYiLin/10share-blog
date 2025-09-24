
import express, { Express } from "express";
import { InlineConfig, ResolvedConfig, ViteDevServer } from "vite";
import fs from 'fs'
import { INDEX_PATH, MANIFEST_PATH } from "#/utils";

export type WebServerHookName = "app:create"  
| "vite:create"  
| "assets:resolve"
| "index:register" 
| "api:register" 
| "app:listen";

export type WebServerHookFn<T extends any[] = any[], R = void> = (...args: T) => R | Promise<R>;
export type WebServerEnv = {
  prod?:boolean
  root?: string
  port?: number
  hrmPort?: number
}

export interface WebServerConfig {
  hooks?: Partial<Record<WebServerHookName, WebServerHookFn[]>>;
  env: Record<string,any> & WebServerEnv
}

export interface WebServerHooks {
  // express app created
  "app:create":(()=>void)[]

  // dev vite create
  "vite:create":(()=>void)[]

  // assets resolve
  "assets:resolve":(()=>void)[]

  // index resolve
  "index:register":((indexProd:string,manifest:any)=>void)[]

  // api register
  "api:register":(()=>void)[]

  // app listen
  "app:listen":(()=>void)[]
}


export class WebServer{
  app: Express | undefined = undefined;
  vite: ViteDevServer | undefined = undefined;
  env: Record<string,any> & WebServerEnv = {}
  hooks?: Partial<Record<WebServerHookName, WebServerHookFn[]>> = {};

  constructor(config: WebServerConfig){
    this.hooks = config.hooks
    this.env = config.env
  }


  /**
   * 调用 hook
   */
  private async callHook<T extends any[], R = void>(
    name: WebServerHookName,
    ...args: T
  ): Promise<R[]> {
    const fns = this.hooks![name] || [];
    const results: R[] = [];
    for (const fn of fns) {
      const res = await fn.call(this,...args);
      results.push(res as R);
    }
    return results;
  }

  // app create
  private async appCreate(){
    this.app = express()
    this.callHook('app:create')
  }

  // dev vite create
  private async viteCreate(){
    this.callHook('vite:create')
  }
  

  private async assetsResolve(){
    this.callHook('assets:resolve')
  }

  private async indexRegister(){
    const indexProd = this.env.prod
      ? fs.readFileSync(INDEX_PATH, "utf-8")
      : "";
    const manifest = this.env.prod
      ? JSON.parse(
          fs.readFileSync(MANIFEST_PATH, "utf-8")
        )
      : "";
    this.callHook('index:register',indexProd,manifest)
  }

  private async apiRegister(){
    this.callHook('api:register')
  }

  private async appListen(){
    this.app!.listen(this.env.port,async ()=>{
      console.log(`http://localhost:${this.env.port}`);
      this.callHook('app:listen')
    })
  }

  // web server run
  public async run(){
    await this.appCreate()
    await this.viteCreate()
    await this.assetsResolve()
    await this.indexRegister()
    await this.apiRegister()
    await this.appListen()
  }
}