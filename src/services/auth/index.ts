import express from "express";
import { asyncHandler } from "../http";
import { handlerLogin, handlerSignout, handlerGetAuth } from "./auth.handler";

const router = express.Router();

router.post("/", asyncHandler(handlerLogin));
router.delete("/", asyncHandler(handlerSignout));
router.get("/", asyncHandler(handlerGetAuth));

export const AuthRouter = router;
