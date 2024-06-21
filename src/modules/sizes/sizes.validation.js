import Joi from "joi";

const sizeSchemaVal = Joi.object({
  name: Joi.string().min(1).max(10).required().trim(),
  description: Joi.string().min(2).max(30).trim().required(),
});
const updatesizeSchemaVal = Joi.object({
  name: Joi.string().min(1).max(10).required().trim(),
  description: Joi.string().min(2).max(30).trim(),
});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});
export { sizeSchemaVal, updatesizeSchemaVal, paramsIdVal };
