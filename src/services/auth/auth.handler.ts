import { v4 as uniqueString } from "uuid";
import { RequestHandler } from "express";
import { dbService } from "../db/db.service";
import { BadRequestException, UnauthorizedException } from "../http";
import { authService } from "./auth.service";

function isFormInvalid(email: string, password: string) {
  return !email || !password;
}

export const handlerLogin: RequestHandler = async (req, res) => {
  if (req.session.uid) {
    return { message: "Already Logged in" };
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
  return;
};

export const handlerSignout: RequestHandler = async (req, res) => {
  if (!req.session.uid) {
    throw new BadRequestException(`User not logged in`);
  }

  req.session.uid = undefined;
  return {
    message: `Successfully logged out`,
  };
};

export const handlerGetAuth: RequestHandler = async (req, res) => {
  const uid = req.session.uid as string;
  if (!uid) {
    throw new UnauthorizedException(`User not logged in`);
  }

  const user = await dbService.findUserFromUid(uid);

  if (!user) {
    throw new BadRequestException(`Cannot get user information`);
  }

  return authService.userDTO(user);
};

export const handlerGetUser: RequestHandler = async (req, res) => {
  const uid = req.query.uid as string;
  if (!uid) {
    throw new BadRequestException(`Cannot parse uid`);
  }

  const user = await dbService.findUserFromUid(uid);
  if (!user) {
    throw new BadRequestException(`Cannot find user from uid`);
  }

  return authService.userDTO(user);
};

interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export const handlerSignup: RequestHandler = async (req, res) => {
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
  return;
};
