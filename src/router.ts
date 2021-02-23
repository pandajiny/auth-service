import {
  handlerGetAuth,
  handlerLogin,
  handlerSignout,
  handlerSignup,
  handlerUpdateUser,
  handlerGetUser,
  handlerWrapper,
} from "./handlers";
import express from "express";

export const authRouter = express.Router();

authRouter.post("/auth", handlerWrapper(handlerLogin));
authRouter.delete("/auth", handlerWrapper(handlerSignout));
authRouter.get("/auth", handlerWrapper(handlerGetAuth));

authRouter.get("/user", handlerWrapper(handlerGetUser));
authRouter.post("/user", handlerWrapper(handlerSignup));
authRouter.put("/user", handlerWrapper(handlerUpdateUser));
