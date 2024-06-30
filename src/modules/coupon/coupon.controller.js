import { couponModel } from "../../../database/models/coupon.model.js";
import { couponhistoryModel } from "../../../database/models/coupon_history.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";

const Insert = AsyncHandler(async (req, res, next) => {
  const checkDocument = await couponModel.findOne({ code: req.body?.code });
  if (checkDocument) next(new AppError(`Coupon is already in use`, 401));

  req.body.createdBy = req.user._id;
  const document = new couponModel(req.body);
  await document.save();

  return res.status(200).json({
    message: "Added Sucessfully",
    data: document,
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
  const document = await couponModel
    .findById(req.params?.id)
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName")
  if (!document) next(new AppError(`Size is not found`, 401));

  res.status(200).json(document);
});

const Delete = AsyncHandler(async (req, res, next) => {
  const document = await couponModel.findByIdAndDelete({ _id: req.params?.id });
  if (!document) next(new AppError(`Coupon is not found`, 401));

  return res.status(200).json({
    message: "Deleted Sucessfully",
    data: document,
  });
});

const Update = AsyncHandler(async (req, res, next) => {
  const document = await couponModel.findByIdAndUpdate(
    { _id: req.params?.id },
    req.body
  );
  if (!document) next(new AppError(`Coupon is not found`, 401));

  return res.status(200).json({
    message: "Updated Sucessfully",
    data: document,
  });
});

const checkCoupon = AsyncHandler(async (req, res, next) => {
  const { text } = req.query; // Ensure text is provided
  // Find the coupon in the database
  const coupon = await couponModel.findOne({ text });
  // Check if the coupon exists
  if (!coupon) return next(new AppError(`Coupon not found`, 401));

  const user = await couponhistoryModel.findById({ user: req.user._id });
  if (user) return next(new AppError(`Coupon used before`, 401));

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
