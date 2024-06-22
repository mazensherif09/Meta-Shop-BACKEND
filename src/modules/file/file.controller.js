import FileModel from "../../../database/models/file.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";

const Insert = AsyncHandler(async (req, res, next) => {
  const data = await FileModel.insertMany(req.body) 
  return res.status(200).json(data);
});

const GetAll = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements
  const populateArray = [];

  let filterObject = {};
  if (req.query.filters) {
    filterObject = req.query.filters;
  }

  let apiFetcher = new ApiFetcher(colorModel.find(filterObject), req.query);

  apiFetcher.search().sort().select().populate(populateArray);

  // Execute the modified query and get total count
  const total = await colorModel.countDocuments(apiFetcher.queryOrPipeline);

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
const GetOne = AsyncHandler(async (req, res, next) => {
  const file = await FileModel.findOne(req?.params?.id);
  if (!file) next(new AppError(`File is not found`, 404));
  return res.status(200).json(file);
});
const Delete = AsyncHandler(async (req, res, next) => {
  const file = await FileModel.findByIdAndDelete({ _id: req.params?.id });
  if (!file) next(new AppError(`File is not found`, 404));
  return res.status(200).json(file);
});

export { Insert, GetAll, GetOne, Delete };
