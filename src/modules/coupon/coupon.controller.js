import { couponModel } from "../../../database/models/coupon.model.js";
import { couponhistoryModel } from "../../../database/models/coupon_history.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne, FindAll, FindOne } from "../handlers/crudHandler.js";

const Errormassage = "coupon not found";
const Insert = AsyncHandler(async (req, res, next) => {
  const checkDocument = await couponModel.findOne({ code: req.body?.code });
  if (checkDocument)
    next(new AppError({ message: `Coupon is already in use`, code: 401 }));

  req.body.createdBy = req.user._id;
  let data = new couponModel(req.body);
  await data.save();
  data = {
    ...data?._doc,
    createdBy: { fullName: req.user.fullName, _id: req.user._id },
  };
  return res.status(200).json({
    message: "Added Sucessfully",
    data,
  });
});
const Update = AsyncHandler(async (req, res, next) => {
  const data = await couponModel
    .findByIdAndUpdate({ _id: req.params?.id }, req.body)
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");
  if (!data) next(new AppError(httpStatus.NotFound));

  return res.status(200).json({
    message: "Updated Sucessfully",
    data,
  });
});
const checkCoupon = AsyncHandler(async (req, res, next) => {
  const { text } = req.query; // Ensure text is provided
  // Find the coupon in the database
  const coupon = await couponModel.findOne({
    text,
    expires: {
      lt: new Date(),
    },
  });
  // Check if the coupon exists
  if (!coupon)
    return next(new AppError({ message: `Coupon not found`, code: 401 }));
  const isUsedBefore = await couponhistoryModel.findOne({
    user: req.user._id,
    coupon: coupon?._id,
  });
  if (isUsedBefore)  return next(new AppError({ message: `Coupon used before`, code: 401 }));

  return res.status(200).json({
    message: "Coupon is valid",
    data: {
      coupon: {
        _id: coupon._id,
        text: coupon.text,
        discount: coupon.discount,
      },
    },
  });
});

const getOne = FindOne(couponModel, Errormassage)
const GetAll = FindAll(couponModel);
const Delete = deleteOne(couponModel);




export { Insert, GetAll, Delete, Update, checkCoupon, getOne };
