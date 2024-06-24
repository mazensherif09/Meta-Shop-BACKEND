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

const Errormassage = "product not found";

const addproduct = AsyncHandler(async (req, res, next) => {
  const { type } = req.body;

  const check = await productModel.findOne({ name: req.body.name });
  if (check)
    return next(new AppError(` product already exist with same name`, 401));
  req.body.slug = slugify(req.body.name);

  // req.body.createdBy = req.user._id;
  let product;
  if (type === "clothes") {
    product = new ClothesModel(req.body);
  } else if (type === "decor") {
    product = new DecorModel(req.body);
  } else {
    return res.status(400).send("Invalid category");
  }

  await product.save();
  return res.status(201).send({
    message: "Product saved successfully",
    data: product,
  });
});

const getallproduct = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements
  const populateArray = [];

  let filterObject = {};
  if (req.query.filters) {
    filterObject = req.query.filters;
  }

  let pipeline = [];
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
      as: "posterImage",
      pipeline: [
        {
          $project: { url: 1, _id: 0 },
        },
      ],
    },
  });

  // Instantiate ApiFetcher with the pipeline and search query
  const apiFetcher = new ApiFetcher(pipeline, req.query);

  // Apply various methods of ApiFetcher
  apiFetcher.sort().select().search();

  // Get total count before executing the final aggregate query
  const total = await apiFetcher.getTotalCount(productModel);

  // Apply pagination after getting total count
  apiFetcher.pagination();

  // Execute the final aggregate query
  const data = await productModel.aggregate(apiFetcher.queryOrPipeline);

  if (data.length === 0) {
    throw new AppError("No products found", 404);
  }

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
  if (mongoose.Types.ObjectId.isValid(req.params.slug)) {
    query = { _id: req.params.slug };
  } else {
    query = { slug: req.params.slug };
  }

  const document = await productModel.findOne(query);
  if (!document) return next(new AppError(Errormassage, 404));
  return res.json(document);
});

const updateproduct = AsyncHandler(async (req, res, next) => {
  // Find the product first to determine its type
  const product = await productModel.findById(req.params.id);
  if (!product) {
    next(new AppError("Product not found", 404));
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

  const updatedProduct = await model.findByIdAndUpdate(
    req.params.id,
    req?.body,
    {
      new: true,
    }
  );
  if (!updatedProduct) return next(new AppError(Errormassage, 404));

  return res.status(200).json({
    message: "Updated Sucessfully",
    data: updatedProduct,
  });
});
const deleteproduct = deleteOne(productModel, Errormassage);
export {
  addproduct,
  getallproduct,
  getOneproduct,
  updateproduct,
  deleteproduct,
};

/*
 let imgCover = ""; // intial value
  if (files?.imgCover) imgCover = files?.imgCover[0]?.path || ""; // set value if admin sent feild imgCover
  const images = files?.images?.map((val) => val?.path); // set value if admin sent feild images
  newProduct.images = await Promise.all(
    images.map(async (val) => await Uploader(val)) // promise => looping on custom function to upload images to cloudinary
  );
  newProduct.imgcover = await Uploader(imgCover); // custom function to upload images to cloudinary

*/
