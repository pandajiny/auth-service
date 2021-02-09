import { createHmac } from "crypto";
import { HASH_SALT } from "../constants";
import { UnauthorizedException } from "../handlers/exception.handler";

async function validatePassword(password: string, _password?: string) {
  // LEGACY
  if (
    _password != createHmac("sha256", HASH_SALT).update(password).digest("hex")
  ) {
    throw new UnauthorizedException(`Password invalid`);
  }
}

const userDTO = (user: User): UserDTO => {
  return { email: user.email, name: user.name, uid: user.uid };
};

export const authService = {
  validatePassword,
  userDTO,
};
