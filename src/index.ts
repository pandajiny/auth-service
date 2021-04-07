import { API_PORT, CERT_PATH, KEY_PATH } from "./constants";
import fs from "fs";
import http from "http";
import https from "https";
import { app } from "./app";

async function bootstrap() {
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
