import { UserModel } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";

export const checkEmailuser = AsyncHandler(async (req, res, next) => {
  if (req.body.email) {
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) return next(new AppError("user already exists. ", 409));
  }
  next();
});
