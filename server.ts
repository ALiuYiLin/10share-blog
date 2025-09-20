import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs'
import express from 'express'

export async function createServer(
  root: string = process.cwd(),
  isProd: boolean = process.env.NODE_ENV?.trim() === 'production',
  hrmPort?: number
){
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  console.log('isProd: ', isProd);

  const resolve = (p:string) => path.resolve(__dirname,p)

  const indexProd = isProd 
  ? fs.readFileSync(
    resolve('dist/client/index.html'),'utf-8')
  : ''

  const manifest = isProd
  ? JSON.parse(
    fs.readFileSync(
      resolve('dist/client/.vite/ssr-manifest.json'),'utf-8')
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
      (await import('serve-static')).default(resolve('dist/client'),{
        index: false
      })
    )
  }


  app.use('*all', async(req, res) =>{
    try{
      const url = req.originalUrl
      let template, render
      if(!isProd){
        // dev
        template = fs.readFileSync(resolve('index.html'),'utf-8')

        template = await vite!.transformIndexHtml(url,template)

        render = (await vite!.ssrLoadModule('/src/entry-server')).render
      }else {
        // prod
        template = indexProd
        render = (await import('./dist/server/entry-server')).render
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
