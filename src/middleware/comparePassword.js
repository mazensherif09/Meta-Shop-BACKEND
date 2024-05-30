import bcrypt from "bcrypt";
import { AppError } from "../utils/AppError.js";

export const comparePassword = async (req, res, next) => {
  const { newpassword, currentpassword } = req.body;
  if (!bcrypt.compareSync(currentpassword, res?.locals?.user?.password))
    return next(new AppError("current password wrong !", 401));
  if (bcrypt.compareSync(newpassword, res?.locals?.user?.password))
    next(
      new AppError(
        "The password cannot be changed because it is the same as the current password",
        401
      )
    );
 return next();
};
