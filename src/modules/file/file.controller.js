import { FileModel } from "../../../database/models/file.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";
import { Uploader, deleteFileCloudinary } from "../../utils/cloudnairy.js";

const Insert = AsyncHandler(async (req, res, next) => {
  const { files } = req.files;
  if (!files || files === 0) {
    return next(new AppError("No files uploaded", 400));
  }

  const uploadResults = await Promise.all(
    files.map(async (file) => {
      try {
        return {
          ...(await Uploader(file.path)),
          filename: file?.filename,
          size: file?.size,
          mimetype: file?.mimetype,
          originalname: file?.originalname,
        };
      } catch (error) {}
    })
  );
  const savedFiles = await FileModel.insertMany(uploadResults?.filter(Boolean));
  res.status(201).json({
    data: savedFiles,
  });
});
const GetAll = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements
  const populateArray = [];



  let apiFetcher = new ApiFetcher(FileModel.find(), req.query);
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
  const file = await FileModel.findOne({ _id: req?.params?.id })
  .populate("createdBy", "fullName")
  .populate("updatedBy", "fullName")
  if (!file) next(new AppError(`File is not found`, 404));
  return res.status(200).json(file);
});
const Delete = AsyncHandler(async (req, res, next) => {
  let id = req.params.id;
  const deletedFile = await FileModel.findByIdAndDelete(id, {
    new: true,
  });

  if (!deletedFile) {
    return next(new AppError("file not found", 404));
  }
  await deleteFileCloudinary(deletedFile?.public_id);
  res.status(200).json({
    message: "File deleted successfully",
  });
});

export { Insert, GetAll, GetOne, Delete };
