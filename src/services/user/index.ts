import express from "express";
import { handlerGetUser, handlerSignup } from "../auth/auth.handler";
import { asyncHandler } from "../http";

const router = express.Router();

router.get("/", asyncHandler(handlerGetUser));
router.post("/", asyncHandler(handlerSignup));

export const UserRouter = router;
