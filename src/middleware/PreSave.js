import slugify from "slugify";
import { updateFileCloudinary } from "../utils/cloudnairy.js";
import { AppError } from "../utils/AppError.js";
import { AsyncHandler } from "./AsyncHandler.js";

export const PreSaveFunction = (model, Errormassage, slug, img) => {
  return AsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let title = req.body[slug];
    let document = undefined;
    if (id) {
      document = await model.findById({ _id: id });

      if (!document)
        return next(new AppError(`${Errormassage} not exist`, 401));
    }
    if (title) {
      req.body.slug = slugify(title);
      const check_New_Name = await model.findOne({ [slug]: title });
      if (
        check_New_Name &&
        check_New_Name?._id?.toString() !== document?._id?.toString()
      )
        return next(new AppError(`${Errormassage} name is already taken`, 401));
    }
    if (req.files) {
      req.body[img] = await updateFileCloudinary(
        req.files[img].path,
        document[img]?.public_id
      );
      return next();
    } else {
      return next();
    }
  });
};
