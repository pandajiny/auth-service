import { RequestHandler } from "express-serve-static-core";
import {
  AsyncRequestHandler,
  BadRequestException,
  UnauthorizedException,
} from ".";
import { HttpStatus } from "../constants";
import { dbService, authService } from "../services";
import { v4 as uniqueString } from "uuid";

function isFormInvalid(email: string, password: string) {
  return !email || !password;
}

export const handlerLogin: AsyncRequestHandler = async (req, res) => {
  if (req.session.uid) {
    throw new BadRequestException(`Already logged in`);
  }

  const { email, password } = req.body;
  if (isFormInvalid(email, password)) {
    throw new BadRequestException(`Invalid form`);
  }
  const user = await dbService.findUserFromEmail(email);

  if (!user) {
    throw new UnauthorizedException(`user not found`);
  }
  await authService.validatePassword(password, user._password);

  req.session.uid = user.uid;
  res.sendStatus(HttpStatus.OK);
};

export const handlerSignout: AsyncRequestHandler = async (req, res) => {
  if (!req.session.uid) {
    throw new BadRequestException(`User not logged in`);
  }

  req.session.uid = undefined;
  res.status(HttpStatus.OK).json({
    message: `Successfully logged out`,
  });
};

export const handlerGetAuth: AsyncRequestHandler = async (req, res) => {
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

export const handlerGetUser: AsyncRequestHandler = async (req, res) => {
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

interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export const handlerSignup: AsyncRequestHandler = async (req, res) => {
  const request = req.body as SignUpRequest;
  const { email, name, password } = request;

  await dbService.findUserFromEmail(email).then((u) => {
    if (u) {
      throw new BadRequestException("User already exist");
    }
  });
  const uid = uniqueString();
  const user: User = {
    email,
    name,
    uid,
    _password: authService.hashPassword(password),
  };

  await dbService.createUser(user);

  res.sendStatus(HttpStatus.OK);
};
export const handlerUpdateUser: AsyncRequestHandler = async () => {};
