import { NextFunction, Request, Response } from "express";

interface AsyncRequestHandler {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}
