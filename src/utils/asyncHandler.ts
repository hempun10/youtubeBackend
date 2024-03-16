import { NextFunction, Request, Response } from "express";
import { ControllerType } from "../types/types.js";

const asyncHandler = (fun: ControllerType) => {
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fun(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
