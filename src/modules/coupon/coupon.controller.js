import { couponModel } from "../../../database/models/coupon.model.js";
import { couponhistoryModel } from "../../../database/models/coupon_history.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";

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

const GetAll = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements
  const populateArray = [];

  let apiFetcher = new ApiFetcher(couponModel.find(), req.query);
  apiFetcher.filter().search().sort().select();

  // Execute the modified query and get total count
  const total = await couponModel.countDocuments(apiFetcher.queryOrPipeline);

  // Apply pagination after getting total count
  apiFetcher.pagination();

  // Execute the modified query to fetch data
  const data = await apiFetcher.queryOrPipeline.exec();

  // Calculate pagination metadata
  const pages = Math.ceil(total / apiFetcher.metadata.pageLimit);

  res.status(200).json({
    success: true,
    data,
    metadata: {
      ...apiFetcher.metadata,
      pages,
      total,
    },
  });
});

const getOne = AsyncHandler(async (req, res, next) => {
  const data = await couponModel
    .findById(req.params?.id)
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");
  if (!data) next(new AppError(httpStatus.NotFound));

  res.status(200).json(data);
});

const Delete = AsyncHandler(async (req, res, next) => {
  const data = await couponModel.findByIdAndDelete({ _id: req.params?.id });
  if (!data) next(new AppError(httpStatus.NotFound));

  return res.status(200).json({
    message: "Deleted Sucessfully",
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
  const coupon = await couponModel.findOne({ text });
  // Check if the coupon exists
  if (!coupon)
    return next(new AppError({ message: `Coupon not found `, code: 401 }));

  const user = await couponhistoryModel.findById({ user: req.user._id });
  if (user)
    return next(new AppError({ message: `Coupon used before`, code: 401 }));

  // Check if the coupon is expired
  const currentDate = new Date();
  if (coupon.expires && coupon.expires < currentDate) {
    return res.status(400).json({ message: "Coupon has expired" });
  }

  // Create a new entry in the coupon history
  const newCouponHistory = new couponhistoryModel({
    user: req.user._id,
    coupon: coupon._id,
  });
  await newCouponHistory.save();

  // Coupon is valid
  return res.status(200).json(coupon);
});

export { Insert, GetAll, Delete, Update, checkCoupon, getOne };
