import { DEV_ENTRY_SERVER_PATH, DEV_INDEX_PATH,ENTRY_SERVER_PATH } from "#/utils";
import { WebServer } from "../web-server";
import fs from 'fs'

export async function indexRegister(this: WebServer,indexProd:string,manifest:any) {
    const _this = this
    this.app!["get"]("/", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let template, render;
        if (!_this.env.prod) {
          // dev
          template = fs.readFileSync(DEV_INDEX_PATH, "utf-8");

          template = await _this.vite!.transformIndexHtml(url, template);

          render = (await _this.vite!.ssrLoadModule(DEV_ENTRY_SERVER_PATH)).render;
        } else {
          // prod
          template = indexProd;
          // @ts-ignore
          render = (await import(ENTRY_SERVER_PATH)).render;
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
    
}