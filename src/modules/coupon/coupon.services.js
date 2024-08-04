import httpStatus from "../../assets/messages/httpStatus.js";
import { AppError } from "../../utils/AppError.js";
import { couponModel } from "./../../../database/models/coupon.model.js";

export const FindCouponWithVerfiy = async ({ filters, user }) => {
  const result = await couponModel.aggregate([
    {
      $match: {
        publish: true,
        expiresAt: { $gt: new Date() },
        ...filters,
      },
    },
    {
      $lookup: {
        from: "couponhistory",
        localField: "_id",
        foreignField: "coupon",
        as: "history",
      },
    },
    {
      $project: {
        code: 1,
        expiresAt: 1,
        isUsedBefore: {
          $in: [user._id, "$history.user"],
        },
      },
    },
  ]);
  const [coupon = null] = result;
  if (!coupon) throw new AppError(httpStatus.NotFound);
  if (coupon.isUsedBefore)
    throw new AppError(
      httpStatus.badRequest,
      "Coupon already used by this user"
    );
  return coupon;
};
