import slugify from "slugify";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";

export const InsertOne = (model, massage, slug, check) => {
  return AsyncHandler(async (req, res, next) => {
    if (check) {
      let checkObject = { [slug]: req.body[slug] };
      const checkDocument = await model.findOne(checkObject);
      if (checkDocument)
        return next(
          new AppError({ message: `this ${slug} is already exist `, code: 401 })
        );
    }
    req.body.slug = slugify(req.body[slug]);
    const document = new model(req.body);
    await document.save();
    let data = {
      ...document?._doc,
      createdBy: { fullName: req.user.fullName, _id: req.user._id },
    };
    return res.status(200).json({
      message: "Added Sucessfully",
      data,
    });
  });
};
export const FindAll = ({ model, massage, param, populateArray }) => {
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
export const FindOne = (model, massage) => {
  return AsyncHandler(async (req, res, next) => {
    const document = await model
      .findById(req.params.id)
      .populate("createdBy", "fullName")
      .populate("updatedBy", "fullName");
    if (!document) return next(new AppError({ massage, code: 404 }));
    return res.status(200).json(document);
  });
};
export const updateOne = (model, massage, slug, check) => {
  return AsyncHandler(async (req, res, next) => {
    if (check && req.body[slug]) {
      let checkObject = {
        $and: [{ [slug]: req.body[slug] }, { _id: { $ne: req.params.id } }],
      };
      const checkDocument = await model.findOne(checkObject);
      if (checkDocument)
        return next(
          new AppError({ message: `this ${slug} is already exist `, code: 401 })
        );
      req.body.slug = slugify(req.body[slug]);
    }

    let data = await model
      .findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      .populate("createdBy", "fullName");
    data = {
      ...data?._doc,
      updatedBy: { fullName: req.user.fullName, _id: req.user._id },
    };
    if (!data) return next(new AppError({ massage, code: 404 }));
    return res.status(200).json({
      message: "Updated Sucessfully",
      data,
    });
  });
};
export const deleteOne = (model, massage) => {
  return AsyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndDelete({ _id: req.params.id });
    if (!document) return next(new AppError({ massage, code: 404 }));
    return res.status(200).json({
      message: "Deleted Sucessfully",
      data: document,
    });
  });
};
