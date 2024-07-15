import slugify from "slugify";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { Uploader } from "../../utils/cloudnairy.js";
import {
  productModel,
  ClothesModel,
  DecorModel,
} from "./../../../database/models/product.model.js";
import {
  FindAll,
  FindOne,
  deleteOne,
  updateOne,
} from "../handlers/crudHandler.js";
import { addLookup } from "../../utils/addLookup.js";
import { ApiFetcher } from "../../utils/Fetcher.js";
import mongoose from "mongoose";
import { colorModel } from "../../../database/models/color.model.js";
import { categoryModel } from "../../../database/models/category.model.js";
import { sizeModel } from "../../../database/models/size.model.js";
import httpStatus from "../../assets/messages/httpStatus.js";
import responseHandler from "../../utils/responseHandler.js";

const Errormassage = "product not found";

const addproduct = AsyncHandler(async (req, res, next) => {
  const { type } = req.body;

  const check = await productModel.findOne({ name: req.body.name });
  if (check)
    return next(
      new AppError(
        responseHandler(
          "conflict",
          undefined,
          `product already exist with same name`
        )
      )
    );
  req.body.slug = slugify(req.body.name);
  req.body.createdBy = req.user._id;
  let data;
  if (type === "clothes") {
    data = new ClothesModel(req.body);
  } else if (type === "decor") {
    data = new DecorModel(req.body);
  } else {
    return res.status(400).send("Invalid product type");
  }
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

const getallproduct = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements

  let pipeline = [
    {
      $match: {
        publish: true,
      },
    },
  ];
  if (req?.user?.role === "admin") {
    pipeline = [];
  }
  // Add category lookup if category is provided
  if (req.query.category) {
    addLookup(
      pipeline,
      req.query,
      "category",
      "categories",
      "category",
      "_id",
      "slug"
    );
  }
  // Add color lookup and match stages if color is provided
  if (req.query.color) {
    addLookup(
      pipeline,
      req.query,
      "color",
      "colors",
      "colors.color",
      "_id",
      "name"
    );
  }
  // Add size lookup and match stages if size is provided
  if (req.query.size) {
    addLookup(
      pipeline,
      req.query,
      "size",
      "sizes",
      "colors.sizes.size",
      "_id",
      "name"
    );
  }

  // Add lookup for poster
  pipeline.push({
    $lookup: {
      from: "files",
      localField: "poster",
      foreignField: "_id",
      as: "poster",
      pipeline: [
        {
          $project: { url: 1, _id: 0 },
        },
      ],
    },
  });
  //
  // Add a stage to replace the posterImage array with its first element
  pipeline.push({
    $addFields: {
      poster: { $arrayElemAt: ["$poster", 0] },
    },
  });

  // Instantiate ApiFetcher with the pipeline and search query
  const apiFetcher = new ApiFetcher(pipeline, req.query);

  // Apply various methods of ApiFetcher
  apiFetcher.sort().select().search().filter();

  // Get total count before executing the final aggregate query
  const total = await apiFetcher.getTotalCount(productModel);

  // Apply pagination after getting total count
  apiFetcher.pagination();

  // Execute the final aggregate query
  const data = await productModel.aggregate(apiFetcher.queryOrPipeline);

  const pages = Math.ceil(total / apiFetcher.metadata.pageLimit);

  return res.status(200).json({
    data,
    metadata: {
      ...apiFetcher.metadata,
      pages,
      total,
    },
  });
});

const getOneproduct = AsyncHandler(async (req, res, next) => {
  let query;
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    query = { _id: req.params.id };
  } else {
    query = { slug: req.params.id };
  }
  let document = null;
  if (req?.user?.role == "admin") {
    document = await productModel
      .findOne(query)
      .populate("createdBy", "fullName")
      .populate("updatedBy", "fullName");
  } else {
    query.published = true;
    document = await productModel.findOne(query);
  }

  if (!document) return next(new AppError(httpStatus.NotFound));
  return res.json(document);
});

const getFilters = AsyncHandler(async (req, res, next) => {
  let query = {
    published: true,
    limit: 20,
  };
  const colors = await colorModel.find(query).lean();
  const categories = await categoryModel.find(query).lean();
  const sizes = await sizeModel.find(query).lean();

  return res.status(200).json({
    message: "success",
    colors,
    categories,
    sizes,
  });
});

const updateproduct = AsyncHandler(async (req, res, next) => {
  // Find the product first to determine its type
  const product = await productModel.findById(req.params.id);
  if (!product)
    return next(new AppError(responseHandler("NotFound", "product")));

  if (req.body.name) {
    // check is name is already in database to avoid duplicates
    const check = await productModel.findOne({
      name: req.body.name,
      _id: { $ne: product?._id },
    });
    if (check)
      return next(
        new AppError(
          responseHandler(
            "conflict",
            undefined,
            `product already exist with same name`
          )
        )
      );
    req.body.slug = slugify(req.body.name);
  }

  let model;
  switch (product?.type) {
    case "decor":
      model = DecorModel;
      break;
    case "clothes":
      model = ClothesModel;
      break;
    default:
      model = productModel;
  }
  let data = await model
    .findByIdAndUpdate(req.params.id, req?.body, {
      new: true,
    })
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");
  data = {
    ...data?._doc,
    updatedBy: { fullName: req.user.fullName, _id: req.user._id },
  };
  return res.status(200).json({
    message: "Updated Sucessfully",
    data,
  });
});

const deleteproduct = deleteOne(productModel, Errormassage);

export {
  addproduct,
  getallproduct,
  getOneproduct,
  updateproduct,
  deleteproduct,
  getFilters,
};
