import { AppError } from "../../utils/AppError.js";

export function AsyncHandler(fun) {
  return (req, res, next) => {
    fun(req, res, next).catch((error) => {
      next(new AppError({ message: error, code: 500 }));
    });
  };
}
