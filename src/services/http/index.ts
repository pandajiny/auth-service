import { ErrorRequestHandler, RequestHandler } from "express";
import { HTTP_STATUS } from "../../constants";

export class HttpException {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(HTTP_STATUS.UNAUTHORIZED, message);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(HTTP_STATUS.BAD_REQUEST, message);
  }
}

export const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next))
      .then((result: any) => {
        if (result) {
          res.status(HTTP_STATUS.OK).json(result);
        } else {
          res.sendStatus(HTTP_STATUS.NO_CONTENt);
        }
      })
      .catch((err) => next(err));
  };
};

export const exceptionHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);
  if (err instanceof HttpException) {
    res.status(err.status).send(err.message);
  } else {
    console.error(err);
    res.status(500).send(`Internal Server Error`);
  }
};

export const logMiddleWare: RequestHandler = (req, res, next) => {
  console.log(``);
  console.log(`${req.method} ${req.path} ${req.sessionID}`);
  next();
};
