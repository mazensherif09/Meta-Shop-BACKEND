import Joi from "joi";

const subCategorySchemaVal = Joi.object({
  name: Joi.string().min(3).max(30).required().trim(),
  category: Joi.string().hex().length(24).required(),
});
const UpdatesubCategorySchemaVal = Joi.object({
  id: Joi.string().hex().length(24),
  name: Joi.string().min(3).max(30).trim(),
  category: Joi.string().hex().length(24),
});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});
export { subCategorySchemaVal, UpdatesubCategorySchemaVal, paramsIdVal };
