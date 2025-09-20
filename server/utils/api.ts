import { Request, Response, NextFunction } from "express";

export function wrapApi(
  apiHandler: (req: Request, res: Response, next: NextFunction) => any | Promise<any>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await apiHandler(req, res, next);
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
  apiHandler: (req: Request, res: Response, next: NextFunction) => any | Promise<any>
}