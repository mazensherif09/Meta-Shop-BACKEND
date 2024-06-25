import { UserModel } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const protectedRoutes = AsyncHandler(async (req, res, next) => {
  // 1- Check if token exists
  let token = req.headers.token || req.params.token || req.cookies.token;
  if (!token) return next(new AppError("Token is not provided", 401));
  try {
    // 2- Verify token
    const decoded =  jwt.verify(token, process.env.SECRETKEY);
    // 3- Check if user exists
    const user = await UserModel.findById(decoded._id);
    if (!user) return next(new AppError("User is not found", 401));
    // 4- Check if user is blocked
    if (user.isblocked) return next(new AppError("User is blocked", 401));
    // 5- Check if user token is valid (password changed after token was issued)
    if (user.passwordChangedAt) {
      const passwordChangedAtTime = parseInt(
        user.passwordChangedAt.getTime() / 1000,
        10
      );
      if (passwordChangedAtTime > decoded.iat) {
        return next(new AppError("Invalid token", 401));
      }
    }
    req.user = user;
    next();
  } catch (err) {
    return next(new AppError(err.message, 401));
  }
});
