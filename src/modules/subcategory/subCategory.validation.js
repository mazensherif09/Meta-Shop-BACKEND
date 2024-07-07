import Joi from "joi";
import { CategorySchemaVal } from "../category/category.validation.js";
import { relationFileVal } from "../file/file.validation.js";
let ObjectIdVal = Joi.string().hex().length(24);
let poster = Joi.alternatives().try(ObjectIdVal, relationFileVal);

const subCategorySchemaVal = Joi.object({
  name: Joi.string().min(1).max(30).required().trim(),
  category: Joi.alternatives().try(ObjectIdVal, CategorySchemaVal),
  description: Joi.string().min(3).max(1500).required(),
  poster: poster,
  _id: ObjectIdVal,
});
const UpdatesubCategorySchemaVal = Joi.object({
  id: ObjectIdVal,
  name: Joi.string().min(1).max(30).trim(),
  category: Joi.alternatives().try(ObjectIdVal, CategorySchemaVal),
  description: Joi.string().min(3).max(1500),
  poster: poster,
  _id: ObjectIdVal,
});
const paramsIdVal = Joi.object({
  id: ObjectIdVal,
});
export { subCategorySchemaVal, UpdatesubCategorySchemaVal, paramsIdVal };
