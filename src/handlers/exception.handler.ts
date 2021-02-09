import { HttpStatus } from "../constants";

export class HttpException {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(HttpStatus.UNAUTHORIZED, message);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(HttpStatus.BAD_REQUEST, message);
  }
}
