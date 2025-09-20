import path from "path";
import { fileURLToPath } from "url";
import fs, { copyFile } from "fs";
import express, { Express } from "express";
import { Api, wrapApi } from "./server/utils/index.js";
import { ViteDevServer } from "vite";
import { PROJECT_ROOT } from "./server/utils/file.js";
import chokidar from 'chokidar';

const modulePath = new URL('./server/api/docs.ts', import.meta.url).pathname;






export async function createServer(
  root: string = process.cwd(),
  isProd: boolean = process.env.NODE_ENV?.trim() === "production",
  hrmPort?: number
): Promise<{
  app: Express;
  vite: ViteDevServer | undefined;
}> {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const resolve = (p: string) => path.resolve(__dirname, p);

  const indexProd = isProd
    ? fs.readFileSync(resolve("./client/index.html"), "utf-8")
    : "";

  const manifest = isProd
    ? JSON.parse(
        fs.readFileSync(resolve("./client/.vite/ssr-manifest.json"), "utf-8")
      )
    : "";

  const app = express();

  let vite;

  if (!isProd) {
    vite = await (
      await import("vite")
    ).createServer({
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
    });

    app.use(vite.middlewares);
    // vite.ws.send({type:'full-reload'})
  } else {
    app.use((await import("compression")).default());
    app.use(
      (await import("serve-static")).default(resolve("./client"), {
        index: false,
      })
    );
  }

  function isApi(v: any): v is Api {
    return (
      v &&
      typeof v === "object" &&
      "path" in v &&
      "method" in v &&
      "apiHandler" in v
    );
  }

  const APIS = await import("./server/api/index.js");

  const exportedApis = Object.entries(APIS)
    .filter(([_, v]) => isApi(v))
    .map(([_, v]) => v) as Api[];
  console.log("PROJECT_ROOT: ", PROJECT_ROOT);
  exportedApis.forEach((api) => {
    (app as any)[api.method](
      api.path,
      wrapApi(api.apiHandler, { context: { manifest } })
    );
    console.log(`注册接口: [${api.method.toUpperCase()}] ${api.path}`);
  });

  app.use("*all", async (req, res) => {
    try {
      const url = req.originalUrl;
      console.log("url: ", url);
      let template, render;
      if (!isProd) {
        // dev
        template = fs.readFileSync(resolve("index.html"), "utf-8");

        template = await vite!.transformIndexHtml(url, template);

        render = (await vite!.ssrLoadModule("/src/entry-server")).render;
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

  return { app, vite };
}

createServer().then(({ app }) => {
  app.listen(5173, async() => {
    console.log(`http://localhost:5173`);
    async function loadModule() {
      // 动态导入模块，每次都会得到最新版本
      const mod = await import(`${modulePath}?t=${Date.now()}`); // ?t 防缓存
      return mod;
    }
    let mod = await loadModule();
    function runModule() {
      if (mod.run) {
        mod.run()
      } else if (mod.default) {
        mod.default()
      }
    }
    runModule()

    const watcher = chokidar.watch(modulePath);
    watcher.on('change', async () => {
      console.log('module changed, reloading...');
      mod = await loadModule();
      runModule()
    });
    
  });
});
