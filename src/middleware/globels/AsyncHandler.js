import { AppError } from "../../utils/AppError.js";

export function AsyncHandler(fun) {
  return (req, res, next) => {
    fun(req, res, next).catch((error) => {
      if (process.env.NODE_ENV === "dev") {
        console.log(error);
      }
      next(new AppError({ message: error, code: 500 }));
    });
  };
}
