import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { UserModel } from "../../database/models/user.model.js";
import { AsyncHandler } from "./AsyncHandler.js";


export const auth = AsyncHandler(async (req, res, next) => {
  const token = req.headers.token;
  if (!token) return next(new AppError('Token not provided', 401));

  jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
    if (err) return next(new AppError(err, 401));

    const user = await UserModel.findById(decoded?.user);
    if (!user) return next(new AppError("User not found", 401));

    if (user?.isblocked) return next(new AppError("User is blocked", 401));

    res.locals.user = user;
    return next();
  });
});
