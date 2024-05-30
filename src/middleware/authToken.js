
import { UserModel } from "../../database/models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { AsyncHandler } from "./AsyncHandler.js";
import jwt from "jsonwebtoken";
export const authToken = AsyncHandler(async (req, res, next) => {
  let token = req.headers.token;
  if (req.params.token) token = req.params.token;
  jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
    if (err) return next(new AppError(err, 401));

    const user = await UserModel.findOne({ email: decoded.email });

    if (!user) return next(new AppError(`user not found`, 401));

    if (user?.isblocked) return next(new AppError("user is blocked", 401));

    if (!user.isresetPassword) return next(new AppError("session closed", 401));

    res.locals.user = user;
    return next();
  });
});
