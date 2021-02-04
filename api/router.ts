import {
  getAuthHandler,
  loginHandler,
  signoutHander,
  signupHandler,
  updateUserHandler,
  AsyncRequestHandler,
} from "./handlers";
import express, { RequestHandler } from "express";
// import { handlerWrapper } from "./app";

export const handlerWrapper = (
  handler: AsyncRequestHandler
): RequestHandler => {
  return (req, res, next) => {
    handler(req, res, next).catch((err) => {
      next(err);
    });
  };
};

export const authRouter = express.Router();

authRouter.post("/auth", handlerWrapper(loginHandler));
authRouter.delete("/auth", signoutHander);
authRouter.get("/auth", getAuthHandler);

authRouter.post("/user", signupHandler);
authRouter.put("/user", updateUserHandler);
