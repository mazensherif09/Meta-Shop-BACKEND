import { AppError } from "../utils/AppError.js";

export function catchError(Fn) {
    return(req, res, next) => {
      Fn(req, res, next).catch(err => {
        next(new AppError(err, 500))
      });
    }
}