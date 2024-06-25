import { AppError } from "../../utils/AppError.js";

export function AsyncHandler(fun) {
  return (req, res, next) => {
    fun(req, res, next).catch(error => {
      console.log("🚀 ~ fun ~ error:", error)
      next(new AppError(error, 500))
    });
  };
}
