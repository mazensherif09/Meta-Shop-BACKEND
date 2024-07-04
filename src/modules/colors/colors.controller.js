import { colorModel } from "../../../database/models/color.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";

const Insert = AsyncHandler(async (req, res, next) => {
  const checkDocument = await colorModel.findOne({ name: req.body?.name });
  if (checkDocument) next(new AppError(`Name is already in use`, 401));

  req.body.createdBy = req.user._id;
  const data = new colorModel(req.body);
  await data.save();

  return res.status(200).json({
    message: "Added Sucessfully",
    data,
  });
});

const GetAll = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements
  const populateArray = [];

  let apiFetcher = new ApiFetcher(colorModel.find(), req.query);
  apiFetcher.filter().search().sort().select();

  // Execute the modified query and get total count
  const total = await colorModel.countDocuments(apiFetcher.queryOrPipeline);

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
  const document = await colorModel
    .findById(req.params?.id)
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");
  if (!document) next(new AppError(`Size is not found`, 401));

  res.status(200).json(document);
});

const Delete = AsyncHandler(async (req, res, next) => {
  const document = await colorModel.findByIdAndDelete({ _id: req.params?.id });
  if (!document) next(new AppError(`Color is not found`, 401));

  return res.status(200).json({
    message: "Deleted Sucessfully",
  });
});

const Update = AsyncHandler(async (req, res, next) => {
  const data = await colorModel
    .findByIdAndUpdate({ _id: req.params?.id }, req.body)
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");
  if (!data) next(new AppError(`Color is not found`, 401));

  return res.status(200).json({
    message: "Updated Sucessfully",
    data,
  });
});

export { Insert, GetAll, Delete, Update, getOne };
