import Joi from "joi";

const CategorySchemaVal = Joi.object({
  name: Joi.string().min(3).max(30).required().trim(),
  img: Joi.object({
    fieldname: Joi.string(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    mimetype: Joi.string().valid("image/jpeg", "image/png"),
    size: Joi.number().max(5242880),
    destination: Joi.string(),
    filename: Joi.string(),
    path: Joi.string(),
  }),
});
const UpdateCategorySchemaVal = Joi.object({
  name: Joi.string().min(3).max(30).trim(),
  id: Joi.string().hex().length(24).required(),
  img: Joi.object({
    fieldname: Joi.string(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    mimetype: Joi.string().valid("image/jpeg", "image/png"),
    size: Joi.number().max(5242880),
    destination: Joi.string(),
    filename: Joi.string(),
    path: Joi.string(),
  }),
});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});
export { CategorySchemaVal, UpdateCategorySchemaVal, paramsIdVal };
