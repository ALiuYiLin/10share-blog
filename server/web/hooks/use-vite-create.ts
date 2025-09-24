import { InlineConfig, ResolvedConfig } from 'vite';
import { WebServer } from '../web-server'


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

// when vite create use, init vite wen dev
export async function viteCreateHook(this: WebServer) {
  if(this.env.prod) return
  this.vite = await (
      await import("vite")
    ).createServer(viteServerOptions(this.env.root!, this.env.hrmPort));
  this.app?.use(this.vite.middlewares);
}
