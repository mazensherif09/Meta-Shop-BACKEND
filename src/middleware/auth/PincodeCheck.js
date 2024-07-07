import httpStatus from "../../assets/messages/httpStatus.js";
import { AppError } from "../../utils/AppError.js";
import { AsyncHandler } from "../globels/AsyncHandler.js";

export const PincodeCheck = AsyncHandler(async (req, res, next) => {
  if (req.user.Pincode !== req.body.pincode)
    return next(new AppError(httpStatus.badRequest));
  next();
});
