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

  const check = await SingleTypeModel.findOne({key: req.body.key});
  if (check)
    return next(new AppError(`page already exist with same title`, 401));

  let page;
  if (PageType === "question") {
    page = new questionPageModel(rest);
  } else if (PageType === "landing") {
    page = new landingPageModel(rest);
  } else if (PageType === "about_us") {
    page = new aboutPageModel(rest);
  } else if (PageType === "products_page") {
    page = new productsPageModel(rest);
  } else {
    return res.status(400).send("Invalid Page Type");
  }

  await page.save();
  res.status(201).send(page);
});

const getPage = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements
  const populateArray = [];

  let filterObject = {};
  if (req.query.filters) {
    filterObject = req.query.filters;
  }

  let apiFetcher = new ApiFetcher(
    SingleTypeModel.find(filterObject),
    req.query
  );

  apiFetcher.search().sort().select().populate(populateArray);

  // Execute the modified query and get total count
  const total = await SingleTypeModel.countDocuments(
    apiFetcher.queryOrPipeline
  );

  // Apply pagination after getting total count
  apiFetcher.pagination();

  // Execute the modified query to fetch data
  const data = await apiFetcher.queryOrPipeline.exec();

  // Calculate pagination metadata
  const pages = Math.ceil(total / apiFetcher.metadata.pageLimit);

  res.status(200).json({
    succses: true,
    data,
    metadata: {
      ...apiFetcher.metadata,
      pages,
      total,
    },
  });
});

const deletePag = AsyncHandler(async (req, res, next) => {
  const document = await SingleTypeModel.findByIdAndDelete({
    _id: req.params?.id,
  });
  if (!document) next(new AppError(`Influncer is not found`, 401));

  res.status(200).json({
    succses: true,
    data: document,
  });
});

const updatePage = AsyncHandler(async (req, res, next) => {
  // req.body.createdBy = req.user._id;
  const document = await SingleTypeModel.findByIdAndUpdate(
    { _id: req.params?.id },
    req.body
  );
  if (!document) next(new AppError(`Influncer not found`, 401));

  res.status(200).json({
    succses: true,
  });
});

export { insert, getPage, deletePag, updatePage };
