import express from "express";
import cors, { CorsOptions } from "cors";
import { json as JsonParser } from "body-parser";
import session from "express-session";
import redis from "redis";
import redisConnect from "connect-redis";
import { REDIS_HOST, REDIS_PORT, FRONTEND_URL } from "./constants";
import { exceptionHandler } from "./handlers";
import { authRouter } from "./router";
export const app = express();

const RedisStore = redisConnect(session);
const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

const corsOptions: CorsOptions = {
  credentials: true,
  origin: FRONTEND_URL,
};

app.use(
  session({
    secret: `secret`,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: new RedisStore({
      port: 4379,
      client: redisClient,
      ttl: 86400,
    }),
  })
);
app.use(cors(corsOptions));
app.use(JsonParser());

app.get("/", (req, res) => {
  res.send(`auth server is running`);
});

app.use(authRouter);
app.use(exceptionHandler);

// export const app = mainApp;
