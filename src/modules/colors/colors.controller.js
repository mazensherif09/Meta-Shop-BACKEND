import { cartModel } from "../../../database/models/cart.model.js";
import { colorModel } from "../../../database/models/color.model.js";
import { orderModel } from "../../../database/models/order.model.js";
import { productModel } from "../../../database/models/product.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";
import { convertObjectKeys } from "../../utils/convertObjectKeys.js";

const addColor = AsyncHandler(async (req, res, next) => {
  const checkDocument = await colorModel.findOne({ name: req.body?.name });
  if (checkDocument) next(new AppError(`Name is already in use`, 401));

  const document = new colorModel(req.body);
  await document.save();

  res.status(200).json({
    succses: true,
    data: document,
  });
});

const getColors = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements
  const populateArray = [];
  
  let filterObject = {};
  if (req.query.filters) {  
     filterObject = req.query.filters;
  }

  let apiFetcher = new ApiFetcher(
    colorModel.find(filterObject) , req.query);

  apiFetcher.search().sort().select().populate(populateArray);

  // Execute the modified query and get total count
  const total = await colorModel.countDocuments(apiFetcher.queryOrPipeline);

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

const deleteColor = AsyncHandler(async (req, res, next) => {
  const document = await colorModel.findByIdAndDelete({ _id: req.params?.id });
  if (!document) next(new AppError(`Color is not found`, 401));

  res.status(200).json({
    succses: true,
    data: document,
  });
});

const updateColor = AsyncHandler(async (req, res, next) => {
  const document = await colorModel.findByIdAndUpdate({ _id: req.params?.id }, req.body);
  if (!document) next(new AppError(`Color is not found`, 401));

  res.status(200).json({
    succses: true,
    data: document,
  });
});

export { addColor, getColors, deleteColor, updateColor };
