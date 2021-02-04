import { RequestHandler } from "express-serve-static-core";
import {
  AsyncRequestHandler,
  BadRequestException,
  UnauthorizedException,
} from ".";
import { HttpStatus } from "../constants";
import { dbService, authService } from "../services";

export const loginHandler: AsyncRequestHandler = async (req, res, next) => {
  if (req.session.uid) {
    throw new BadRequestException(`Already logged in`);
  }

  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestException(`Invalid form`);
  }
  const user = await dbService.findUserFromEmail(email);

  if (!user) {
    throw new UnauthorizedException(`user not found`);
  }
  await authService.validatePassword(password, user._password);

  req.session.uid = user.uid;
  console.log(`user logged in`, user);
  res.status(HttpStatus.OK).json({
    session_id: req.session.id,
  });
};

export const signoutHander: RequestHandler = () => {};
export const getAuthHandler: RequestHandler = () => {};

export const signupHandler: RequestHandler = () => {};
export const updateUserHandler: RequestHandler = () => {};
