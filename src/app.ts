import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import { corsOptions, sessionOptions } from "./constants";
import { AuthRouter } from "./services/auth";
import { logMiddleWare, exceptionHandler } from "./services/http";
import { UserRouter } from "./services/user";

export const app = express();

app.use(cors(corsOptions));
app.use(session(sessionOptions));
app.use(bodyParser.json());

app.use(logMiddleWare);
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use(exceptionHandler);
