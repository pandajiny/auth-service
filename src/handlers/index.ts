import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { HttpException } from "./exception.handler";

export interface AsyncRequestHandler {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const exceptionHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);
  if (err instanceof HttpException) {
    res.status(err.status).send(err.message);
  } else {
    console.error(err);
    res.status(500).send(`Internal Server Error`);
  }
};

export * from "./auth.handler";
export * from "./exception.handler";
