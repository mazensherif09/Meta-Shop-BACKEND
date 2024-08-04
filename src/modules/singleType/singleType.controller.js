import {
  SingleTypeModel,
  aboutPageModel,
  landingPageModel,
  warningPageModel,
  faqPageModel,
  privacyPolicyPageModel,
  legalPageModel,
} from "../../../database/models/singleType.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";

const insert = AsyncHandler(async (req, res, next) => {
  const key = req.key;
  req.body.key = key;
  const check = await SingleTypeModel.findOne({ key });
  if (check)
    return next(new AppError(`page already exist with same title`, 401));

  let Model;

  switch (key) {
    case "warning":
      Model = new warningPageModel(req.body);
      break;
    case "about_us":
      Model = new aboutPageModel(req.body);
      break;
    case "faq":
      Model = new faqPageModel(req.body);
      break;
    case "landing":
      Model = new landingPageModel(req.body);
      break;
    case "privacy_policy":
      Model = new privacyPolicyPageModel(req.body);
      break;
    case "legal":
      Model = new legalPageModel(req.body);
      break;
    default:
      return res.status(400).send("Invalid Page Type");
  }
  await Model.save();
  return res.status(201).send({
    message: "page saved successfully",
    data: Model,
  });
});

const getPage = AsyncHandler(async (req, res, next) => {
  let query = { key: req.params.key };
  let document = null;
  if (req?.user?.role == "admin") {
    document = await SingleTypeModel.findOne(query)
      .populate("createdBy", "fullName")
      .populate("updatedBy", "fullName");
  } else {
    document = await SingleTypeModel.findOne(query);
  }

  if (!document) return next(new AppError(`Page is not found`, 404));
  return res.status(200).json(document);
});

const updatePage = AsyncHandler(async (req, res, next) => {
  // Find the single Model first to determine its type
  let key = req.key;
  const singleModel = await SingleTypeModel.findOne({ key });
  if (!singleModel) {
    return next(new AppError("Page not found", 404));
  }

  let model;
  switch (singleModel?.key) {
    case "warning":
      model = warningPageModel;
      break;
    case "landing":
      model = landingPageModel;
      break;
    case "about_us":
      model = aboutPageModel;
      break;
    case "faq":
      model = faqPageModel;
      break;
    case "privacy_policy":
      model = privacyPolicyPageModel;
      break;
    case "legal":
      model = legalPageModel;
      break;
    default:
      model = singleModel;
  }

  const data = await model
    .findByIdAndUpdate(singleModel?._id, req?.body, {
      new: true,
    })
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");
  if (!data) return next(new AppError("Page not found", 404));

  return res.status(200).json({
    message: "Updated Sucessfully",
    data,
  });
});

export { insert, getPage, updatePage };
