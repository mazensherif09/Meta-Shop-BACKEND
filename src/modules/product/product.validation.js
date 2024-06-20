import Joi from "joi";

const ProductSchemaVal = Joi.object({
  title: Joi.string().min(3).max(300).required().trim(),
  description: Joi.string().min(15).max(1500).required(),
  category: Joi.string().hex().length(24),
  subcategory: Joi.string().hex().length(24),
  price: Joi.number().min(0).required(),
  discount: Joi.number().min(0).optional(),
  quantity: Joi.number().min(0),
});
const UpdateproductSchemaVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  title: Joi.string().min(3).max(300).trim().optional(),
  description: Joi.string().min(15).max(1500).optional(),
  category: Joi.string().hex().length(24).optional(),
  brand: Joi.string().hex().length(24).optional(),
  subcategory: Joi.string().hex().length(24).optional(),
  price: Joi.number().min(0).optional(),
  discount: Joi.number().min(0).optional(),

});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});

export { ProductSchemaVal, UpdateproductSchemaVal, paramsIdVal };
