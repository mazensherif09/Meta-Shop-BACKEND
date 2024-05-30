import { AppError } from "../utils/AppError.js";
import { AsyncHandler } from "./AsyncHandler.js";

export const authorized = (permissions) => {
  return AsyncHandler(async (req, res, next) => {
    if (!permissions.includes(req.locals.user.role))
      return next(new AppError("you are not authorized"));

    next();
  });
};
