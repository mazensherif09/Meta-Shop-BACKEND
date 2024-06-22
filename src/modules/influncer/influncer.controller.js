import { influencerModel } from "../../../database/models/influencer.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";

const request = AsyncHandler(async (req, res, next) => {
  // req.body.influencer = req.user._id;

  const document = new influencerModel(req.body);
  await document.save();

  res.status(200).json(document);
});

const GetAll = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements
  const populateArray = [];

  let filterObject = {};
  if (req.query.filters) {
    filterObject = req.query.filters;
  }

  let apiFetcher = new ApiFetcher(
    influencerModel.find(filterObject),
    req.query
  );
  apiFetcher.filter().search().sort().select();
  // Execute the modified query and get total count
  const total = await influencerModel.countDocuments(
    apiFetcher.queryOrPipeline
  );

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

const Delete = AsyncHandler(async (req, res, next) => {
  const document = await influencerModel.findByIdAndDelete({
    _id: req.params?.id,
  });
  if (!document) next(new AppError(`Influncer is not found`, 401));

  return res.status(200).json({
    message: "Deleted Sucessfully"
  });
});

const Update = AsyncHandler(async (req, res, next) => {
  // req.body.createdBy = req.user._id;
  const document = await influencerModel.findByIdAndUpdate(
    { _id: req.params?.id },
    req.body
  );
  if (!document) next(new AppError(`Influncer not found`, 401));

  return res.status(200).json({
    message: "Updated Sucessfully",
    document
  });
});

export { request, GetAll, Delete, Update };
