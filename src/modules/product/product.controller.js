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
    return next(new AppError(` product already  exist with same title`, 401));
  req.body.slug = slugify(req.body.title);
  req.body.createdBy = req.user._id;

  const data = new productModel(req.body); // pre save the for the  model
  await data.save(); // finallay save in database
  res.json({ data }); // to return new product and save more time
  let imgCover = ""; // intial value
  if (files?.imgCover) imgCover = files?.imgCover[0]?.path || ""; // set value if admin sent feild imgCover
  const images = files?.images?.map((val) => val?.path); // set value if admin sent feild images
  data.images = await Promise.all(
    images.map(async (val) => await Uploader(val)) // promise => looping on custom function to upload images to cloudinary
  );
  data.imgcover = await Uploader(imgCover); // custom function to upload images to cloudinary
  // await data.save(); // finallay save in database
  // return res.json({
  //   data,
  // });
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
