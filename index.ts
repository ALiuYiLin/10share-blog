import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import express, { Express } from "express";
import { Api, wrapApi } from "./server/utils";
import { InlineConfig, ResolvedConfig, ViteDevServer } from "vite";



const viteServerOptions = (root: string, hrmPort?: number) => {
  return {
    root,
    logLevel: "info",
    server: {
      middlewareMode: true,
      watch: {
        usePolling: true,
        interval: 100,
      },
      hmr: {
        port: hrmPort,
      },
    },
    appType: "custom",
  } as InlineConfig | ResolvedConfig;
};


function isApi(v: any): v is Api {
  return (
    v &&
    typeof v === "object" &&
    "path" in v &&
    "method" in v &&
    "apiHandler" in v
  );
}

type HookName = "app:init" | "app:created" | "app:destroy" | "vite:create" | "index:register";
type HookFn<T extends any[] = any[], R = void> = (...args: T) => R | Promise<R>;

interface WebServerConfig {
  hooks?: Partial<Record<HookName, HookFn[]>>;
}

interface WebServerHooks {
  "index:register": ((msg:string) => void)[]
  "vite:create":((vite:ViteDevServer)=>void)[]
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const resolve = (p: string) => path.resolve(__dirname, p);

class WebServer {
  app: Express | undefined = undefined;
  port: number = 3000;
  prod: boolean = process.env.NODE_ENV?.trim() === "production";
  root: string = process.cwd();
  vite: ViteDevServer | undefined = undefined;
  hooks?: Partial<Record<HookName, HookFn[]>> = {};
  hrmPort?: number;

  constructor(config: WebServerConfig) {
    this.hooks = config.hooks;
  }


  /**
   * 调用 hook
   */
  private async callHook<T extends any[], R = void>(
    name: HookName,
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


  private async appInit() {
    //
    this.app = express();
    //
  }

  private async viteCreate() {
    if (this.prod) return;
    this.vite = await (
      await import("vite")
    ).createServer(viteServerOptions(this.root, this.hrmPort));
    this.app?.use(this.vite.middlewares);
    // excute vite create hooks
  }

  private async assetsRegister(){
    if(this.prod) return
    this.app!.use((await import("compression")).default());
    this.app!.use(
      (await import("serve-static")).default(resolve("./client"), {
        index: false,
      })
    );
  }


  private async indexRegister() {
    const indexProd = this.prod
      ? fs.readFileSync(resolve("./client/index.html"), "utf-8")
      : "";

    const manifest = this.prod
      ? JSON.parse(
          fs.readFileSync(resolve("./client/.vite/ssr-manifest.json"), "utf-8")
        )
      : "";
    
    const _this = this
    
    this.app!["get"]("/", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let template, render;
        if (!_this.prod) {
          // dev
          template = fs.readFileSync(resolve("index.html"), "utf-8");

          template = await _this.vite!.transformIndexHtml(url, template);

          render = (await _this.vite!.ssrLoadModule("/src/entry-server")).render;
        } else {
          // prod
          template = indexProd;
          // @ts-ignore
          render = (await import("./server/entry-server.js")).render;
        }
        const [appHtml, preloadLinks] = await render(url, manifest);

        const html = template
          .replace(`<!--preload-links-->`, preloadLinks)
          .replace(`<!--app-html-->`, appHtml);

        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e: any) {
        res.status(500).end(e.stack);
      }
    });
    const msg = 'hello'
    this.callHook('index:register',msg)
  }


  private async apiRegister() {
    const APIS = await import("./server/api/index.js");
    const exportedApis = Object.entries(APIS)
      .filter(([_, v]) => isApi(v))
      .map(([_, v]) => v) as Api[];
    exportedApis.forEach((api) => {
      (this.app as any)[api.method](
        api.path,
        wrapApi(api.apiHandler, { context: {} })
      );
      console.log(`注册接口: [${api.method.toUpperCase()}] ${api.path}`);
    });

  }

  private async serverListen() {
    this.app?.listen(this.port, async () => {
      console.log(`http://localhost:${this.port}`);
    });
  }

  public async run() {
    await this.appInit();
    await this.viteCreate();
    await this.assetsRegister();
    await this.apiRegister();
    await this.indexRegister();
    await this.serverListen();
  }
}

function testHook(this:WebServer,msg:string){
  console.log('after index:register msg: ', msg);
}

(async () => {
  const webServer = new WebServer({
    hooks:{
      'index:register':[
        testHook
      ]
    } as WebServerHooks
  });
  await webServer.run();
})();
