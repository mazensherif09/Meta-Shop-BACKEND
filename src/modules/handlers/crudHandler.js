import slugify from "slugify";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFetcher } from "../../utils/Fetcher.js";
import httpStatus from "../../assets/messages/httpStatus.js";
import responseHandler from "./../../utils/responseHandler.js";

export const InsertOne = ({
  model,
  slug = null,
  name = "",
  uniqueFields = [],
}) => {
  return AsyncHandler(async (req, res, next) => {
    if (uniqueFields?.length) {
      const queryForCheck = {
        $or: [],
      };
      for (let i = 0; i < uniqueFields.length; i++) {
        if (req.body?.[uniqueFields[i]]) {
          queryForCheck.$or.push({
            [uniqueFields[i]]: req.body?.[uniqueFields[i]],
          });
        }
      }
      if (slug && req.body?.[slug]) {
        queryForCheck.push({
          [slug]: req.body?.[slug],
        });
      }
      const checkdata = await model.findOne(queryForCheck);
      if (checkdata) {
        return next(
          new AppError(
            responseHandler("conflict", undefined, `${name} is already exists `)
          )
        );
      }
    } else if (req.body?.[slug]) {
      const checkDocument = await model.findOne({
        [slug]: req.body[slug],
      });
      if (checkDocument)
        return next(
          new AppError(
            responseHandler("conflict", undefined, `${name} is already exists`)
          )
        );
      req.body.slug = slugify(req?.body?.[slug]);
    }
    const document = new model(req.body);
    await document.save();
    let data = {
      ...document?._doc,
      createdBy: { fullName: req.user.fullName, _id: req.user._id },
    };
    return res.status(200).json({
      message: `${name} Added Sucessfully`,
      data,
    });
  });
};
export const FindAll = ({
  model,
  defaultSort = "createdAt:desc",
  customQuery = null, // Function to define custom query logic
  pushToPipeLine = [],
}) => {
  return AsyncHandler(async (req, res, next) => {
    // Handle filter with lookup and apply custom query logic
    let pipeline = handleFilterwithLookUp(customQuery, query?.filters);
    // Add custom query to pipeline
    pipeline = pipeline.concat(pushToPipeLine);
    let sort = query?.sort || defaultSort;
    // Add sort field to pipeline
    query.sort = sort;
    const apiFetcher = new ApiFetcher(pipeline, query)
      .filter()
      .sort()
      .select()
      .search()
      .pagination();
    // Fetch data
    const data = await model.aggregate(apiFetcher.pipeline).exec();
    // Calculate total pages
    const total = await apiFetcher.count(model);
    // Calculate total pages
    const pages = Math.ceil(total / apiFetcher.metadata.pageLimit);
    let responsedata = {
      data,
      metadata: {
        ...apiFetcher.metadata,
        pages,
        total,
      },
    };
    return res.status(200).json(responsedata);
  });
};
export const FindOne = ({ model, name = "" }) => {
  return AsyncHandler(async (req, res, next) => {
    let user = req?.user;
    const query = handleQuerySlugOrid(params?.id);
    let data = null;
    if (user?.role == "admin") {
      data = await model
        .findOne(query)
        .populate("createdBy", "fullName")
        .populate("updatedBy", "fullName");
    } else {
      data = await model.findOne(query);
    }
    if (!data) return next(new AppError(responseHandler("NotFound", name)));
    return res.status(200).json(data);
  });
};
export const updateOne = ({
  model,
  name = "",
  slug = "",
  uniqueFields = [],
}) => {
  return AsyncHandler(async (req, res, next) => {
    if (uniqueFields?.length) {
      const queryForCheck = {
        _id: { $ne: params?.id },
        $or: [],
      };
      for (let i = 0; i < uniqueFields.length; i++) {
        if (req.body?.[uniqueFields[i]]) {
          queryForCheck.$or.push({
            [uniqueFields[i]]: req.body?.[uniqueFields[i]],
          });
        }
      }
      if (slug && req.body?.[slug]) {
        queryForCheck.push({
          [slug]: req.body?.[slug],
        });
      }
      const checkdata = await model.findOne(queryForCheck);
      if (checkdata) {
        return next(
          new AppError(
            responseHandler("conflict", undefined, `${name} is already exists `)
          )
        );
      }
    } else if (req.body?.[slug]) {
      const checkDocument = await model.findOne({
        [slug]: req.body[slug],
        _id: { $ne: params?.id },
      });
      if (checkDocument)
        return next(
          new AppError(
            responseHandler("conflict", undefined, `${name} is already exists`)
          )
        );
      req.body.slug = slugify(req?.body?.[slug]);
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
      message: `${name} Updated Sucessfully`,
      data,
    });
  });
};
export const deleteOne = ({ model, name = "" }) => {
  return AsyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndDelete({ _id: req.params.id });
    if (!document) return next(new AppError(httpStatus.NotFound));
    return res.status(200).json({
      message: `${name} Deleted Sucessfully`,
    });
  });
};
