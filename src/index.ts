import express from "express";
import { json as JsonParser } from "body-parser";
import {
  API_PORT,
  CERT_PATH,
  corsOptions,
  KEY_PATH,
  sessionOptions,
} from "./constants";
import cors from "cors";
import { exceptionHandler, logMiddleWare } from "./handlers";
import { authRouter } from "./router";
import session from "express-session";
import fs from "fs";
import http from "http";
import https from "https";

async function bootstrap() {
  const app = express();

  app.use(cors(corsOptions));
  app.use(session(sessionOptions));
  app.use(JsonParser());

  app.use(logMiddleWare);
  app.use(authRouter);
  app.use(exceptionHandler);

  if (isCertExist()) {
    const credentials: https.ServerOptions = {
      cert: fs.readFileSync(CERT_PATH),
      key: fs.readFileSync(KEY_PATH),
    };
    https.createServer(credentials, app).listen(API_PORT);
    console.log(`RUN HTTPS SERVER`);
  } else {
    http.createServer(app).listen(API_PORT);
    console.log(`RUN HTTP SERVER`);
  }
}

const isCertExist = (): boolean => {
  const paths = {
    keyPath: KEY_PATH,
    certPath: CERT_PATH,
  };
  return fs.existsSync(paths.keyPath) && fs.existsSync(paths.certPath);
};

bootstrap();
