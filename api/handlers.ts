import { RequestHandler } from "express";
import db from "./services/dbService";
import { BadRequestException, UnauthorizedException } from "./exception";
import authService from "./services/authService";
import { AsyncRequestHandler } from "./types/http";
import { HttpStatus } from "./constants";

export const loginHandler: AsyncRequestHandler = async (req, res, next) => {
  if (req.session.uid) {
    throw new BadRequestException(`Already logged in`);
  }

  const { email, password } = req.body;
  const user = await db.findUserFromEmail(email);

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
