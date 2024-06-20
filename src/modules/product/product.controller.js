import slugify from "slugify";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { Uploader } from "../../utils/cloudnairy.js";
import { productModel } from "./../../../database/models/product.model.js";
import {
  FindAll,
  FindOne,
  deleteOne,
  updateOne,
} from "../handlers/crudHandler.js";
const Errormassage = "product not found";

const addproduct = AsyncHandler(async (req, res, next) => {
  const { files } = req;
  const product = await productModel.findOne({ title: req.body.title });
  if (product)
    return next(new AppError(` product already exist with same title`, 401));
  req.body.slug = slugify(req.body.title);
  // req.body.createdBy = req.user._id;
  const newProduct = new productModel(req.body); // pre save the for the  model
  await newProduct.save(); // finallay save in database
  return res.json(newProduct);
});
const getallproduct = FindAll(productModel, "", "", [
  "createdBy",
  "havePermission",
  "subcategory",
  "category",
]);
const getOneproduct = FindOne(productModel, Errormassage);
const updateproduct = updateOne(productModel, Errormassage);
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
