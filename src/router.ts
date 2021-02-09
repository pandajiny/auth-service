import {
  getAuthHandler,
  loginHandler,
  signoutHander,
  signupHandler,
  updateUserHandler,
  AsyncRequestHandler,
  getUserHandler,
} from "./handlers";
import express, { RequestHandler } from "express";

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
authRouter.delete("/auth", handlerWrapper(signoutHander));
authRouter.get("/auth", handlerWrapper(getAuthHandler));

authRouter.get("/user", handlerWrapper(getUserHandler));
authRouter.post("/user", signupHandler);
authRouter.put("/user", updateUserHandler);
