import { Api, APIS_PATH, isApi, wrapApi } from "#/utils";
import { WebServer } from "../web-server";
import { pathToFileURL } from "node:url";



export async function apiRegister(this: WebServer) {
  const APIS = await import(pathToFileURL(APIS_PATH).href);
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