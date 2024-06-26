import {
  SingleTypeModel,
  aboutPageModel,
  landingPageModel,
  warningPageModel,
} from "../../../database/models/singleType.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";

const insert = AsyncHandler(async (req, res, next) => {
  // req.body.influencer = req.user._id;
  req.body.createdBy = req.user._id;
  // Attempt to insert or update a document

  const { key } = req.body;

  const check = await SingleTypeModel.findOne({ key: req.body.key });
  if (check)
    return next(new AppError(`page already exist with same title`, 401));

  let page;
  if (key === "warning") {
    page = new warningPageModel(req.body);
  } else if (key === "landing") {
    page = new landingPageModel(req.body);
  } else if (key === "about_us") {
    page = new aboutPageModel(req.body);
  } else {
    return res.status(400).send("Invalid Page Type");
  }

  await page.save();
  res.status(201).send(page);
});

const getPage = AsyncHandler(async (req, res, next) => {
  const document = await SingleTypeModel.findOne({ key: req.params?.key });
  if (!document) next(new AppError(`Page is not found`, 401));

  return res.status(200).json(document);
});

const updatePage = AsyncHandler(async (req, res, next) => {
  // Find the single Model first to determine its type
  const singleModel = await SingleTypeModel.findOne(req.params.key);
  if (!singleModel) {
    next(new AppError("Page not found", 404));
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
    default:
      model = singleModel;
  }

  const updatedModel = await model.findOneAndUpdate(
    { key: req.params.key },
    req?.body,
    {
      new: true,
    }
  );
  if (!updatedModel) return next(new AppError("Page not found", 404));

  return res.status(200).json({
    message: "Updated Sucessfully",
    data: updatedProduct,
  });
});

export { insert, getPage, updatePage };
