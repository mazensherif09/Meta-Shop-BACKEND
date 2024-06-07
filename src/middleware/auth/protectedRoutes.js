import { UserModel } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "../AsyncHandler.js";
import jwt from "jsonwebtoken";

export const protectedRoutes = AsyncHandler(async (req, res, next) => {
  //1- token is exist or not
  const { token } = req.headers;
  if (req.params.token) token = req.params.token;
  if (!token) return next(new AppError("Token is not provided", 401)); //401
  //2-verfiy token
  jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
    if (err) return next(new AppError(err, 401));
    console.log("🚀 ~ jwt.verify ~ decoded:", decoded)

    //3- User -> exist or not
    const user = await UserModel.findById(decoded?.id);
    if (!user) return next(new AppError("User is not found", 401));
    //4- user blocked or not
    if (user?.isblocked) return next(new AppError("User is blocked", 401));
    //5- user token valid or not
    if (user?.passwordChangedAt) {
      let time = parseInt(user?.passwordChangedAt.getTime() / 1000);
      if (time > decoded.iat) return next(new AppError("Invalid token"));
    }
    req.user = user;
    next();
  });
});
