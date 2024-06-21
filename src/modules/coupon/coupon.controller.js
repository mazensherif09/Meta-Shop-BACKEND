import { cartModel } from "../../../database/models/cart.model.js";
import { couponModel } from "../../../database/models/coupon.model.js";
import { orderModel } from "../../../database/models/order.model.js";
import { productModel } from "../../../database/models/product.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";
import { convertObjectKeys } from "../../utils/convertObjectKeys.js";

const addCoupon = AsyncHandler(async (req, res, next) => {
  const checkDocument = await couponModel.findOne({ text: req.body?.text });
  if (checkDocument) next(new AppError(`Coupon is already in use`, 401));

  const document = new couponModel(req.body);
  await document.save();

  res.status(200).json({
    succses: true,
    data: document,
  });
});

const getCoupon = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements
  const populateArray = [];
  
  let filterObject = {};
  if (req.query.filters) {  
     filterObject = req.query.filters;
  }

  let apiFetcher = new ApiFetcher(
    couponModel.find(filterObject) , req.query);

  apiFetcher.search().sort().select().populate(populateArray);

  // Execute the modified query and get total count
  const total = await couponModel.countDocuments(apiFetcher.queryOrPipeline);

  // Apply pagination after getting total count
  apiFetcher.pagination();

  // Execute the modified query to fetch data
  const data = await apiFetcher.queryOrPipeline.exec();

  // Calculate pagination metadata
  const pages = Math.ceil(total / apiFetcher.metadata.pageLimit);

  res.status(200).json({
    succses: true,
    data,
    metadata: {
      ...apiFetcher.metadata,
      pages,
      total,
    },
  });
});

const deleteCoupon = AsyncHandler(async (req, res, next) => {
  const document = await couponModel.findByIdAndDelete({ _id: req.params?.id });
  if (!document) next(new AppError(`Coupon is not found`, 401));

  res.status(200).json({
    succses: true,
    data: document,
  });
});

const updateCoupon = AsyncHandler(async (req, res, next) => {
  const document = await couponModel.findByIdAndUpdate({ _id: req.params?.id }, req.body);
  if (!document) next(new AppError(`Coupon is not found`, 401));

  res.status(200).json({
    succses: true,
    data: document,
  });
});

const checkCoupon = AsyncHandler(async (req, res, next) => {
     
    const { text } = req.query;  // Ensure text is provided
    // Find the coupon in the database
    const coupon = await couponModel.findOne({ text });
    // Check if the coupon exists
    if (!coupon) return next(new AppError(`Coupon not found`, 401));

    // Check if the coupon is expired
    const currentDate = new Date();
    if (coupon.expires && coupon.expires < currentDate) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    // Coupon is valid
    res.status(200).json({ success: true, message: 'Coupon is valid', coupon });

});

export { addCoupon, getCoupon, deleteCoupon, updateCoupon, checkCoupon };
