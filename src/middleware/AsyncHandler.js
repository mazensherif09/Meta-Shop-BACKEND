import { AppError } from "../utils/AppError";

export function AsyncHandler(fun) {
  return (req, res, next) => {
    fun(req, res, next).catch(error => {
      next(new AppError(error, 500))
    });
  };
}
