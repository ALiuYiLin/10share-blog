import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(import.meta.url)
export const PROJECT_ROOT = path.resolve(__dirname,'..','..','..')
export const APP_ROOT = path.resolve(PROJECT_ROOT,'src')
export const DOCS_ROOT = path.resolve(PROJECT_ROOT,'docs')
export const PROD_DOCS_ROOT = path.resolve(PROJECT_ROOT,'dist/docs')
export const SERVER_ROOT = path.resolve(PROJECT_ROOT,'server')
export const CLIENT_ROOT = path.resolve(PROJECT_ROOT,'client')
export const INDEX_PATH = path.resolve(PROJECT_ROOT,'client/index.html')
export const MANIFEST_PATH = path.resolve(PROJECT_ROOT,'client/.vite/ssr-manifest.json')
export const DEV_INDEX_PATH = path.resolve(PROJECT_ROOT,'index.html')
export const DEV_ENTRY_SERVER_PATH = path.resolve(PROJECT_ROOT,'src/entry-server')
export const ENTRY_SERVER_PATH = path.resolve(PROJECT_ROOT,'server/entry-server.js')

export const APIS_PATH = path.resolve(PROJECT_ROOT,'server/api/index.js')
