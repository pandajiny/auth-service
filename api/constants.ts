import { config } from "dotenv";
config();

export const HttpStatus = {
  // OK
  OK: 200,
  // ERROR
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
};

export const API_PORT = getNumber("API_PORT");

export const FRONTEND_URL = getString("FRONTEND_URL");

export const DB_HOST = getString("DB_HOST");
export const DB_PORT = getNumber("DB_PORT");
export const DB_PASSWORD = getString("DB_PASSWORD");

export const REDIS_HOST = getString("REDIS_HOST");
export const REDIS_PORT = getNumber("REDIS_PORT");

export const HASH_SALT = getString("HASH_SALT");

function getString(key: string): string {
  if (
    process.env.NODE_ENV?.includes("dev") &&
    (key.includes("HOST") || key.includes("PORT"))
  ) {
    key += "_LOCAL";
  }

  const value = process.env[key];
  if (!value) {
    throw `Cannot parse ${key}`;
  }
  return value;
}

function getNumber(key: string): number {
  const value = process.env[key];
  if (!value || parseInt(value) == NaN) {
    throw `Cannot parse API_PORT`;
  }
  return parseInt(value);
}
