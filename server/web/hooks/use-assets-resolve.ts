import { CLIENT_ROOT } from "#/utils";
import { WebServer } from "../web-server";

// when vite create use, init vite wen dev
export async function assetsResolve(this: WebServer) {
  if(!this.env.prod) return
  this.app!.use((await import("compression")).default());
    this.app!.use(
      (await import("serve-static")).default(CLIENT_ROOT, {
        index: false,
      })
    );
}
