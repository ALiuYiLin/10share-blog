import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(import.meta.url)
export const PROJECT_ROOT = path.resolve(__dirname,'..','..','..')
export const DOCS_ROOT = path.resolve(PROJECT_ROOT,'docs')
export const PROD_DOCS_ROOT = path.resolve(PROJECT_ROOT,'dist/docs')
export const SERVER_ROOT = path.resolve(PROJECT_ROOT,'server')