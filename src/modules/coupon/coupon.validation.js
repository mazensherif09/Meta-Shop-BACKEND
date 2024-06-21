import Joi from "joi";

const couponSchemaVal = Joi.object({
  text: Joi.string().min(5).max(30).required().trim(),
  expires: Joi.date().required(),
  discount: Joi.number().integer().options({ convert: false }).required(),
  percentage: Joi.number().integer().options({ convert: false }).required(),
});
const updateCouponSchemaVal = Joi.object({
  id: Joi.string().hex().length(24),
  text: Joi.string().min(3).max(30).required().trim(),
  expires: Joi.date(),
  discount: Joi.number().integer().options({ convert: false }).required(),
});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});
export { couponSchemaVal, updateCouponSchemaVal, paramsIdVal };
