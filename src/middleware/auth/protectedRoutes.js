import { UserModel } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";

import { AsyncHandler } from "../globels/AsyncHandler.js";
import jwt from "jsonwebtoken";
import httpStatus from "../../assets/messages/httpStatus.js";

export const protectedRoutes = AsyncHandler(async (req, res, next) => {
  // 1- Check if token exists
  let token = req.headers.token || req.params.token || req.cookies.token;
  if (!token) return next(new AppError(httpStatus.Forbidden));

  jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
    if (err) return next(new AppError(httpStatus.Forbidden));
    // 3- Check if user exists
    const user = await UserModel.findById(decoded._id).populate("cart").lean();
    if (!user) return next(new AppError(httpStatus.Forbidden));
    // 4- Check if user is blocked
    if (user.isblocked) return next(new AppError(httpStatus.Forbidden));
    // 5- Check if user token is valid (password changed after token was issued)
    if (user.passwordChangedAt) {
      const passwordChangedAtTime = parseInt(
        user.passwordChangedAt.getTime() / 1000,
        10
      );
      if (passwordChangedAtTime > decoded.iat) {
        return next(new AppError(httpStatus.Forbidden));
      }
    }
    req.user = user;
    next();
  });
});
