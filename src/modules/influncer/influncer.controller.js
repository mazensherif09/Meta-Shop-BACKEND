import { influencerModel } from "../../../database/models/influencer.model.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";
import { UserModel } from "../../../database/models/user.model.js";

const InsertOne = AsyncHandler(async (req, res, next) => {
  let check = await influencerModel.findOne({
    socialAccount: req.body.socialAccount,
  });
  if (check)
    return next(new AppError(`Influncer socialName is already in use`, 404));

  req.body.influencer = req.user._id;
  const influencer = new influencerModel(req.body);
  await influencer.save();

  await UserModel.findByIdAndUpdate(req.user._id, {
    influencer: influencer._id,
  });

  return res.status(200).json({
    message: "Send Sucessfully",
    influencer,
  });
});
const requestForBenfluencer = AsyncHandler(async (req, res, next) => {
  let check = await influencerModel.findOne({
    socialAccount: req.body.socialAccount,
  });
  if (check)
    return next(new AppError(`Influncer socialName is already in use`, 404));

  req.body.relatedTo = req.user._id;
  const influencer = new influencerModel(req.body);
  await influencer.save();

  await UserModel.findByIdAndUpdate(req.user._id, {
    influencer: influencer._id,
  });

  return res.status(200).json({
    message: "Send Sucessfully",
    influencer,
  });
});
const GetAll = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements
  const populateArray = [];

  let filterObject = {};
  if (req.query.filters) {
    filterObject = { ...req.query.filters, ...filterObject };
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

const GetOne = AsyncHandler(async (req, res, next) => {
  const document = await influencerModel
    .findById(req.params.id)
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");
  if (!document) return next(new AppError("influencer not found", 404));

  return res.json(document);
});

const Delete = AsyncHandler(async (req, res, next) => {
  const document = await influencerModel.findByIdAndDelete(req.params?.id);
  if (!document) return next(new AppError(`Influncer is not found`, 401));

  await UserModel.findOneAndUpdate({influencer: req.params?.id}, {
    $unset: { influencer: 1 },
  });

  return res.status(200).json({
    message: "Deleted Sucessfully",
  });
});

const Update = AsyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user._id;
  const document = await influencerModel.findByIdAndUpdate(
    { _id: req.params?.id },
    req.body
  );
  if (!document) return next(new AppError(`Influncer not found`, 401));

  return res.status(200).json({
    message: "Updated Sucessfully",
    data: document,
  });
});

export { InsertOne, GetAll, requestForBenfluencer, Delete, Update, GetOne };
