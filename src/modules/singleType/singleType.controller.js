import {
  SingleTypeModel,
  productsPageModel,
  aboutPageModel,
  landingPageModel,
  questionPageModel,
} from "../../../database/models/singleType.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";

const insert = AsyncHandler(async (req, res, next) => {
  // req.body.influencer = req.user._id;
  // req.body.createdBy = req.user._id;
  // Attempt to insert or update a document

  const { PageType, ...rest } = req.body;

  const check = await SingleTypeModel.findOne({ key: req.body.key });
  if (check)
    return next(new AppError(`page already exist with same title`, 401));

  let page;
  if (PageType === "question") {
    page = new questionPageModel(rest, req.body.key);
  } else if (PageType === "landing") {
    page = new landingPageModel(rest, req.body.key);
  } else if (PageType === "about_us") {
    page = new aboutPageModel(rest, req.body.key);
  } else if (PageType === "products_page") {
    page = new productsPageModel(rest, req.body.key);
  } else {
    return res.status(400).send("Invalid Page Type");
  }

  await page.save();
  res.status(201).send(page);
});

const getPage = AsyncHandler(async (req, res, next) => {
  const document = await SingleTypeModel.findById(req.params?.id);
  if (!document) next(new AppError(`Page is not found`, 401));

  return res.status(200).json({
    message: "Added Sucessfully",
    document
  });
});

const deletePag = AsyncHandler(async (req, res, next) => {
  const document = await SingleTypeModel.findByIdAndDelete({
    _id: req.params?.id,
  });
  if (!document) next(new AppError(`Page is not found`, 401));

  res.status(200).json({
    message: "Deleted Sucessfully",
  });
});

const updatePage = AsyncHandler(async (req, res, next) => {
  // req.body.createdBy = req.user._id;
  const document = await SingleTypeModel.findByIdAndUpdate(
    { _id: req.params?.id },
    req.body
  );
  if (!document) next(new AppError(`Page not found`, 401));

  res.status(200).json({
    message: "Updated Sucessfully",
    document
  });
});

export { insert, getPage, deletePag, updatePage };
