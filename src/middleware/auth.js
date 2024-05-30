import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { UserModel } from "../../database/models/user.model.js";


export const auth = async (req, res, next) => {
  jwt.verify(req.headers.token, process.env.SECRETKEY, async (err, decoded) => {
    if (err) return next(new AppError(err, 401));

    const user = await UserModel.findById(decoded?.user);

    if (!user) return next(new AppError("user not found", 401));

    if (user?.isblocked) return next(new AppError("user is blocked", 401));

    res.locals.user = user;
    return next();
  });
};
