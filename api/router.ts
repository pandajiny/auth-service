import express, { RequestHandler } from "express";
import {
  getAuthHandler,
  loginHandler,
  signoutHander,
  signupHandler,
  updateUserHandler,
} from "./handlers";
import { AsyncRequestHandler } from "./types/http";

function asyncHandler(handler: AsyncRequestHandler): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch((err) => {
      next(err);
    });
  };
}

const router = express.Router();

router.post("/auth", asyncHandler(loginHandler));
router.delete("/auth", signoutHander);
router.get("/auth", getAuthHandler);

router.post("/user", signupHandler);
router.put("/user", updateUserHandler);

export const apiRouter = router;
