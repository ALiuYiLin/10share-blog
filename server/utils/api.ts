import { Request, Response, NextFunction } from "express";

export function wrapApi(
  apiHandler: ApiHandler,
  context?:ApiHandlerContext
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bandApiHandler = apiHandler.bind(context!)
      const data = await bandApiHandler(req, res, next);
      // 如果 fn 自己已经返回响应，就不再包裹
      if (res.headersSent) return;

      res.json({
        code: 0,
        message: "success",
        data,
      });
    } catch (err: any) {
      console.error("API Error:", err);
      res.status(500).json({
        code: -1,
        message: err.message || "server error",
      });
    }
  };
}

export interface Api {
  path: string,
  method: string,
  apiHandler: ApiHandler
}

export type ApiHandlerContext= {
  context: Record<string,any>;
};

export type ApiHandler  = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => any | Promise<any>


export function isApi(v: any): v is Api {
  return (
    v &&
    typeof v === "object" &&
    "path" in v &&
    "method" in v &&
    "apiHandler" in v
  );
}