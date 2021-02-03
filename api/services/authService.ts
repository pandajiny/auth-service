import { createHmac } from "crypto";
import { HASH_SALT } from "../constants";
import { UnauthorizedException } from "../exception";

async function validatePassword(password: string, _password?: string) {
  // LEGACY
  if (
    _password != createHmac("sha256", HASH_SALT).update(password).digest("hex")
  ) {
    throw new UnauthorizedException(`Password invalid`);
  }
}

export default {
  validatePassword,
};