import mongoose from "mongoose";
import httpStatus from "../../assets/messages/httpStatus.js";
import { AppError } from "../../utils/AppError.js";
import { couponModel } from "./../../../database/models/coupon.model.js";

export const FindCouponWithVerfiy = async ({ filters, user }) => {
  let matchCondition = {
    expires: { $gt: new Date() },
    publish: true,
  };
  if (filters._id) {
    // Convert _id to ObjectId if it exists in filters
    matchCondition._id = new mongoose.Types.ObjectId(filters._id);
  } else if (filters.code) {
    // Add code to matchCondition if it exists in filters
    matchCondition.code = filters.code;
  }

  const result = await couponModel.aggregate([
    {
      $match: matchCondition,
    },
    {
      $lookup: {
        from: "couponhistories",
        localField: "_id",
        foreignField: "coupon",
        as: "history",
      },
    },
    {
      $project: {
        _id: 1,
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
  if (coupon?.isUsedBefore) throw new AppError({message: "the coupon is used before" , code: 409});
  return coupon;
};
