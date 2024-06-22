import { couponModel } from "../../../database/models/coupon.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";

const Insert = AsyncHandler(async (req, res, next) => {
  const checkDocument = await couponModel.findOne({ text: req.body?.text });
  if (checkDocument) next(new AppError(`Coupon is already in use`, 401));

  const document = new couponModel(req.body);
  await document.save();

 return res.status(200).json(document);
});

const GetAll = AsyncHandler(async (req, res, next) => {
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

  return res.status(200).json({
    data,
    metadata: {
      ...apiFetcher.metadata,
      pages,
      total,
    },
  });
});

const Delete = AsyncHandler(async (req, res, next) => {
  const document = await couponModel.findByIdAndDelete({ _id: req.params?.id });
  if (!document) next(new AppError(`Coupon is not found`, 401));

  res.status(200).json(document);
});

const Update = AsyncHandler(async (req, res, next) => {
  const document = await couponModel.findByIdAndUpdate({ _id: req.params?.id }, req.body);
  if (!document) next(new AppError(`Coupon is not found`, 401));

  return res.status(200).json(document);
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
    return res.status(200).json(coupon);

});

export { Insert, GetAll, Delete, Update, checkCoupon };
