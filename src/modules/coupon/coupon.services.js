import httpStatus from "../../assets/messages/httpStatus.js";
import { AppError } from "../../utils/AppError.js";
import { couponModel } from "./../../../database/models/coupon.model.js";

export const FindCouponWithVerfiy = async ({ filters, user }) => {
  const result = await couponModel.aggregate([
    {
      $match: {
        expires: { $gt: new Date() },
        publish: true,
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
        expires: 1,
        discount: 1,
        isUsedBefore: {
          $in: [user._id, "$history.user"],
        },
      },
    },
  ]);
  const [coupon = null] = result;
  if (!coupon) throw new AppError(httpStatus.NotFound);
  if (coupon?.isUsedBefore) throw new AppError(httpStatus.badRequest);
  console.log("🚀 ~ FindCouponWithVerfiy ~ coupon:", coupon)
  return coupon;
};
