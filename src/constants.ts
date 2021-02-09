import redisConnect from "connect-redis";
import { CorsOptions } from "cors";
import { config } from "dotenv";
import session, { SessionOptions } from "express-session";
import { ConnectionOptions } from "mysql2/promise";
import redis, { ClientOpts } from "redis";

config();

export const HttpStatus = {
  // OK
  OK: 200,
  // ERROR
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
};

export const HASH_SALT = getString("HASH_SALT");

export const API_PORT = getNumber("API_PORT");

export const FRONTEND_URL = getString("FRONTEND_URL");

// USER DB
const DB_HOST = getString("DB_HOST");
const DB_PORT = getNumber("DB_PORT");
const DB_PASSWORD = getString("DB_PASSWORD");
export const dbOptions: ConnectionOptions = {
  host: DB_HOST,
  port: DB_PORT,
  user: "root",
  database: "user_db",
  password: DB_PASSWORD,
};

// SESSION_DB
const REDIS_HOST = getString("REDIS_HOST");
const REDIS_PORT = getNumber("REDIS_PORT");
export const redisClientOptions: ClientOpts = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};
const RedisStore = redisConnect(session);
const redisClient = redis.createClient(redisClientOptions);
export const sessionOptions: session.SessionOptions = {
  secret: `secret`,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  },
  store: new RedisStore({
    port: REDIS_PORT,
    client: redisClient,
    ttl: 86400,
  }),
};

// CORS
export const corsOptions: CorsOptions = {
  credentials: true,
  origin: ["https://scheduler.pandajiny.com", "http://localhost:1234"],
};

// CERT PATHS
export const KEY_PATH = getString("KEY_PATH");
export const CERT_PATH = getString("CERT_PATH");

function getString(key: string): string {
  if (
    process.env.NODE_ENV?.includes("dev") &&
    (key.includes("HOST") || key.includes("PORT") || key.includes("URL"))
  ) {
    key += "_LOCAL";
  }

  const value = process.env[key];
  if (!value) {
    throw `Cannot parse ${key}`;
  }
  console.log(`${key} is ${value}`);
  return value;
}

function getNumber(key: string): number {
  const value = process.env[key];
  if (!value || parseInt(value) == NaN) {
    throw `Cannot parse API_PORT`;
  }

  console.log(`${key} is ${value}`);
  return parseInt(value);
}