import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs'
import express , { Express }from 'express'
import { Api, wrapApi } from "./server/utils";
import { ViteDevServer } from "vite";


export async function createServer(
  root: string = process.cwd(),
  isProd: boolean = process.env.NODE_ENV?.trim() === 'production',
  hrmPort?: number
): Promise<{
    app: Express;
    vite: ViteDevServer | undefined;
}>{
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  console.log('isProd: ', isProd);

  const resolve = (p:string) => path.resolve(__dirname,p)

  const indexProd = isProd 
  ? fs.readFileSync(
    resolve('./client/index.html'),'utf-8')
  : ''

  const manifest = isProd
  ? JSON.parse(
    fs.readFileSync(
      resolve('./client/.vite/ssr-manifest.json'),'utf-8')
  )
  : ''  

  const app = express()

  let vite 

  if(!isProd){
    vite = await ( await import('vite') )
    .createServer({
      root,
      logLevel: 'info',
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100
        },
        hmr: {
          port: hrmPort
        }
      },
      appType: 'custom'
    })

    app.use(vite.middlewares)
  } else {
    app.use((await import('compression')).default())
    app.use(
      (await import('serve-static')).default(resolve('./client'),{
        index: false
      })
    )
  }

  function isApi(v: any): v is Api {
    return v && typeof v === "object" && "path" in v && "method" in v && "apiHandler" in v
  }

  const APIS = await import("./server/api/index.js")

  const exportedApis = Object.entries(APIS).filter(([_,v])=>isApi(v)).map(([_,v])=>v) as Api[]

  exportedApis.forEach(api=>{
    (app as any)[api.method](api.path,wrapApi(api.apiHandler,{context:{manifest}}))
    console.log(`注册接口: [${api.method.toUpperCase()}] ${api.path}`);
  })

  

  app.use('*all', async(req, res) =>{
    try{
      const url = req.originalUrl
      console.log('url: ', url);
      let template, render
      if(!isProd){
        // dev
        template = fs.readFileSync(resolve('index.html'),'utf-8')

        template = await vite!.transformIndexHtml(url,template)

        render = (await vite!.ssrLoadModule('/src/entry-server')).render
      }else {
        // prod
        template = indexProd
        // @ts-ignore
        render = (await import('./server/entry-server.js')).render
      }
      const [appHtml, preloadLinks] = await render(url, manifest)

      const html =  template
      .replace(`<!--preload-links-->`, preloadLinks)
      .replace(`<!--app-html-->`, appHtml)

      res.status(200).set({'Content-Type': 'text/html'}).end(html)
    }catch(e:any){
      res.status(500).end(e.stack)
    }

   
  })

  return { app, vite}
}

createServer().then(({app})=>{
  app.listen(5173,()=>{
    console.log(`http://localhost:5173`)
  })
})
