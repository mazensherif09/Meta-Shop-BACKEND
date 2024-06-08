import jwt from "jsonwebtoken";
import { AsyncHandler } from "../globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { UserModel } from "../../../database/models/user.model.js";

export const protectedRoutesCart = AsyncHandler(async (req, res, next) => {
  //1- token is exist or not
  const { token } = req.headers;
  if (req.params.token) token = req.params.token;
  //2-verfiy token
  if (token) {
    jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
      if (err) return next(new AppError(err, 401));
      console.log("🚀 ~ jwt.verify ~ decoded:", decoded);
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
      return next();
    });
  } else {
    const cart = req.cookies.cart || req.query.cart;
    console.log(cookies);
    if (!cart && req.originalUrl !== "api/cart" && req?.mehtod !== "post") {
      return next(new AppError(" cart is not available"));
    } else {
      req.cart = cart;
    }
    return next();
  }
});
