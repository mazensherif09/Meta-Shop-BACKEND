import Joi from "joi";
let ObjectIdVal = Joi.string().hex().length(24);
const couponSchemaVal = Joi.object({
  code: Joi.string().min(5).max(30).required().trim(),
  expires: Joi.date().required(),
  discount: Joi.number().integer().options({ convert: false }).required(),
  count: Joi.number().integer().options({ convert: false }).required(),
  _id: ObjectIdVal,
});
const updateCouponSchemaVal = Joi.object({
  id: ObjectIdVal,
  _id: ObjectIdVal,
  count: Joi.number().integer().options({ convert: false }).required(),
  code: Joi.string().min(5).max(30).trim(),
  expires: Joi.date(),
  discount: Joi.number().integer().options({ convert: false }),
});
const paramsIdVal = Joi.object({
  id: ObjectIdVal,
  _id: ObjectIdVal,
});
export { couponSchemaVal, updateCouponSchemaVal, paramsIdVal };
