import { sizeModel } from "../../../database/models/size.model.js";
import httpStatus from "../../assets/messages/httpStatus.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";
import responseHandler from "../../utils/responseHandler.js";

const addSize = AsyncHandler(async (req, res, next) => {
  const checkDocument = await sizeModel.findOne({ name: req.body?.name });
  if (checkDocument)
    return next(
      new AppError(
        responseHandler("conflict", undefined, `Name is already in use`)
      )
    );

  req.body.createdBy = req.user._id;
  let data = new sizeModel(req.body);
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

const getSizes = AsyncHandler(async (req, res, next) => {
  let apiFetcher = new ApiFetcher(sizeModel.find(), req.query);
  apiFetcher.filter().search().sort().select();

  // Execute the modified query and get total count
  const total = await sizeModel.countDocuments(apiFetcher.queryOrPipeline);

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
  const document = await sizeModel
    .findById(req.params?.id)
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");
  if (!document) next(new AppError(responseHandler("NotFound", "size")));

  res.status(200).json(document);
});

const deleteSize = AsyncHandler(async (req, res, next) => {
  const document = await sizeModel.findByIdAndDelete({ _id: req.params?.id });
  if (!document) next(new AppError(responseHandler("NotFound", "size")));

  return res.status(200).json({
    message: "Deleted Sucessfully",
  });
});

const updateSize = AsyncHandler(async (req, res, next) => {
  let data = await sizeModel
    .findByIdAndUpdate({ _id: req.params?.id }, req.body)
    .populate("createdBy", "fullName")

  if (!data) next(new AppError(responseHandler("NotFound", "size")));
  data = {
    ...data?._doc,
    updatedBy: { fullName: req.user.fullName, _id: req.user._id },
  };
  return res.status(200).json({
    message: "Updated Sucessfully",
    data,
  });
});

export { addSize, getSizes, deleteSize, updateSize, getOne };
