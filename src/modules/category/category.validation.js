import Joi from "joi";
import { relationFileVal } from "../file/file.validation.js";
let ObjectIdVal = Joi.string().hex().length(24);
let poster = Joi.alternatives().try(ObjectIdVal, relationFileVal);
const CategorySchemaVal = Joi.object({
  _id: ObjectIdVal,
  name: Joi.string().min(3).max(30).required().trim(),
  description: Joi.string().min(10).max(1500).required(),
  poster: poster,
});
const UpdateCategorySchemaVal = Joi.object({
  name: Joi.string().min(3).max(30).trim(),
  id:ObjectIdVal,
  poster: poster,
  description: Joi.string().min(10).max(1500),
});
const paramsIdVal = Joi.object({
  id: ObjectIdVal,
});
export { CategorySchemaVal, UpdateCategorySchemaVal, paramsIdVal };
