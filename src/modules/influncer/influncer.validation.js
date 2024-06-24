import Joi from "joi";
import { influencers } from "../../assets/enums/influeners.js";

const influncerSchemaVal = Joi.object({
  socialName: Joi.string().min(3).max(30),
});
const updateInfluncerSchemaVal = Joi.object({
  id: Joi.string().hex().length(24),
  socialName: Joi.string().min(3).max(30).optional(),
  state: Joi.string().valid(...Object.values(influencers)).optional(),
  coupon: Joi.string().hex().length(24).optional(),
  count: Joi.number().integer().options({ convert: false }).optional(),
  balance: Joi.number().options({ convert: false }).optional(),
});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});
export { influncerSchemaVal, updateInfluncerSchemaVal, paramsIdVal };
