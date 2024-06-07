import slugify from "slugify";
import { productModel } from "../../database/models/product.model.js";
import {
  Uploader,
  deleteFileCloudinary,
  updateFileCloudinary,
} from "../utils/cloudnairy.js";
import { AppError } from "../utils/AppError.js";
import { AsyncHandler } from "./AsyncHandler.js";
export const handleMediaProduct = AsyncHandler(async (req, res, next) => {
  const { files, body } = req;
  const product = res.locals.schema;
  if (!product) return next(new AppError(`product not exist`, 401));
  if (body.title) {
    req.body.slug = slugify(body.title); // to handle slug
    const checknewname = await productModel.findOne({ title: body.title });
    if (
      checknewname &&
      checknewname?._id?.toString() !== product?._id?.toString()
    )
      // to handle th new name is unique
      return next(new AppError(`product name is already taken`, 401));
  }
  if (files) {
    let imgCover; // init value for handle errors
    if (files?.imgCover) imgCover = files?.imgCover[0]?.path; // set value if admin sent feild imgCover
    const images = files?.images?.map((val) => val?.path); // set value if admin sent feild images
    if (imgCover && images) {
      // this condition will work if admin sent images and imgCover together
      await Promise.all(
        product?.images.map(
          async (val) => await deleteFileCloudinary(val.public_id)
        )
      ); // for remove old images (give more space in cloudinary)
      req.body.images = await Promise.all(
        images.map(
          async (val, ind) =>
            await updateFileCloudinary(val, product?.images[ind]?.public_id)
        )
      ); // for upload multiple image in cloudinary
      req.body.imgcover = await updateFileCloudinary(
        imgCover,
        product.imgcover.public_id
      ); // to update image (imgCover) with same url ;)
      return next();
    } else if (images) {
      // this condition will work if admin sent images and didn't sent imgCover
      await Promise.all(
        product?.images.map(
          async (val) => await deleteFileCloudinary(val.public_id)
        )
      );
      req.body.images = await Promise.all(
        images.map(
          async (val, ind) =>
            await updateFileCloudinary(val, product?.images[ind]?.public_id)
        )
      );
      return next();
    } else {
      // this condition will work if admin  didn't sent imgCover and images
      req.body.imgcover = await updateFileCloudinary(
        imgCover,
        product.imgcover.public_id
      );
      return next();
    }
  } else {
    return next();
  }
});
