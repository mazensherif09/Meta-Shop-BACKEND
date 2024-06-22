import { FileModel } from "../../../database/models/file.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";
import { Uploader, deleteFileCloudinary } from "../../utils/cloudnairy.js";

const Insert = AsyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError("No files uploaded", 400));
  }

  const uploadResults = await Promise.all(
    req.files.map((file) => Uploader(file.path))
  );

  const fileDocs = uploadResults.map((result) => ({
    filename: "files",
    public_id: result.public_id,
    url: result.url,
  }));

  const savedFiles = await FileModel.insertMany(fileDocs);

  res.status(201).json({
    data: savedFiles,
  });
});
const GetAll = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements
  const populateArray = [];

  let filterObject = {};
  if (req.query.filters) {
    filterObject = req.query.filters;
  }

  let apiFetcher = new ApiFetcher(FileModel.find(filterObject), req.query);
  apiFetcher.filter().search().sort().select();
  // Execute the modified query and get total count
  const total = await FileModel.countDocuments(apiFetcher.queryOrPipeline);

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
const GetOne = AsyncHandler(async (req, res, next) => {
  const file = await FileModel.findOne(req?.params?.id);
  if (!file) next(new AppError(`File is not found`, 404));
  return res.status(200).json(file);
});
const Delete = AsyncHandler(async (req, res, next) => {
  const { public_id } = req.body;

  const result = await deleteFileCloudinary(public_id);

  if (result.result !== "ok") {
    return next(new AppError("Failed to delete the file", 400));
  }

  const deletedFile = await FileModel.findOneAndDelete({ public_id });
  if (!deletedFile) {
    return next(new AppError("File not found in the database", 404));
  }

  res.status(200).json({
    message: "File deleted successfully",
  });
});

export { Insert, GetAll, GetOne, Delete };
