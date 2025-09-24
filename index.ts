import {
  WebServer,
  WebServerHooks,
  apiRegister,
  appListen,
  assetsResolve,
  indexRegister,
  viteCreateHook,
} from './server'

;(async () => {
  const webServer = new WebServer({
    env: {
      prod: process.env.NODE_ENV?.trim() === 'production',
      port: 5173,
    },
    hooks: {
      'app:create': [],
      'vite:create': [viteCreateHook],
      'assets:resolve': [assetsResolve],
      'api:register': [apiRegister],
      'index:register': [indexRegister],
      'app:listen': [appListen],
    } as Partial<WebServerHooks>,
  })
  await webServer.run()
})()
