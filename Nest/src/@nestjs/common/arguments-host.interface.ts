import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";

export interface ArgumentsHost {
  switchToHttp(): {
    getRequest(): ExpressRequest;
    getResponse(): ExpressResponse;
    getNext(): NextFunction;
  };
}
