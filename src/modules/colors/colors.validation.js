import Joi from "joi";

const colorSchemaVal = Joi.object({
  name: Joi.string().min(3).max(30).required().trim(),
  code: Joi.string().min(2).max(30).required().trim(),
  _id:Joi.string().hex().length(24)
  
});
const updateColorSchemaVal = Joi.object({
  id: Joi.string().hex().length(24),
    name: Joi.string().min(3).max(30).trim(),
    code: Joi.string().min(2).max(30).trim(),
});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});
export { colorSchemaVal, updateColorSchemaVal, paramsIdVal };
