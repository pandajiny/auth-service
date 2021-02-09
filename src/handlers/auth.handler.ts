import { RequestHandler } from "express-serve-static-core";
import {
  AsyncRequestHandler,
  BadRequestException,
  UnauthorizedException,
} from ".";
import { HttpStatus } from "../constants";
import { dbService, authService } from "../services";

export const loginHandler: AsyncRequestHandler = async (req, res) => {
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

export const signoutHander: AsyncRequestHandler = async (req, res) => {
  if (!req.session.uid) {
    throw new BadRequestException(`User not logged in`);
  }

  req.session.uid = undefined;
  res.status(HttpStatus.OK).json({
    message: `Successfully logged out`,
  });
};
export const getAuthHandler: AsyncRequestHandler = async (req, res) => {
  const uid = req.session.uid as string;
  if (!uid) {
    throw new UnauthorizedException(`User not logged in`);
  }

  const user = await dbService.findUserFromUid(uid);

  if (!user) {
    throw new BadRequestException(`Cannot get user information`);
  }

  res.status(HttpStatus.OK).json(authService.userDTO(user));
};

export const getUserHandler: AsyncRequestHandler = async (req, res) => {
  const uid = req.query.uid as string;
  if (!uid) {
    throw new BadRequestException(`Cannot parse uid`);
  }

  // if (req.session.uid != uid) {
  //   throw new UnauthorizedException(`Access denied`);
  // }

  const user = await dbService.findUserFromUid(uid);

  if (!user) {
    throw new BadRequestException(`Cannot find user from uid`);
  }

  res.status(HttpStatus.OK).json(authService.userDTO(user));
};
export const signupHandler: RequestHandler = () => {};
export const updateUserHandler: RequestHandler = () => {};
