import slugify from "slugify";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";

export const InsertOne = (model, Errormassage, slug, check) => {
  return AsyncHandler(async (req, res, next) => {
    if (check) {
      let checkObject = { [slug]: req.body[slug] };
      const checkDocument = await model.findOne(checkObject);
      if (checkDocument) return next(new AppError(Errormassage, 401));
    }
    req.body.slug = slugify(req.body[slug]);
    const document = new model(req.body);
    await document.save();
    return res.status(200).json({
      message: "Added Sucessfully",
      data: document,
    });
  });
};
export const FindAll = ({ model, Errormassage, param, populateArray }) => {
  return AsyncHandler(async (req, res, next) => {
    let filterObject = {};
    if (param && req.params[param]) {
      filterObject[param] = req.params[param];
    }
    let apiFetcher = new ApiFetcher(model.find(filterObject), req.query);
    let total = new ApiFetcher(model.find(filterObject), req.query);
    total.filter().search();
    total = await total.mongooseQuery.countDocuments();
    apiFetcher
      .pagination()
      .filter()
      .search()
      .sort()
      .select()
      .populate(populateArray || []);
    let pages = Math.ceil(total / apiFetcher.metadata.pageLimit);
    let data = await apiFetcher.mongooseQuery;
    return res.status(200).json({
      data,
      metadata: {
        ...apiFetcher.metadata,
        pages,
        total,
      },
    });
  });
};
export const FindOne = (model, Errormassage) => {
  return AsyncHandler(async (req, res, next) => {
    const document = await model.findById(req.params.id);
    if (!document) return next(new AppError(Errormassage, 404));
    return res.status(200).json(document);
  });
};
export const updateOne = (model, Errormassage) => {
  return AsyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(
      req.params.id ,
      req.body,
      { new: true }
    );
    if (!document) return next(new AppError(Errormassage, 404));
    return res.status(200).json({
      message: "Updated Sucessfully",
      data: document,
    });
  });
};
export const deleteOne = (model, Errormassage) => {
  return AsyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndDelete({ _id: req.params.id });
    if (!document) return next(new AppError(Errormassage, 404));
    return res.status(200).json({
      message: "Deleted Sucessfully",
      data: document,
    });
  });
};
