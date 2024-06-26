import Joi from "joi";
import { influencers } from "../../assets/enums/influeners.js";

const requestForBenfluencerVal = Joi.object({
  socialAccount: Joi.string().min(3).max(30),
});

const InfluncerVal = Joi.object({
  id: Joi.string().hex().length(24),
  socialAccount: Joi.string().min(3).max(30).optional(),
  state: Joi.string()
    .valid(...Object.values(influencers))
    .optional(),
  coupon: Joi.object({
    _id: Joi.string().hex().length(24).optional(),
    code: Joi.string(),
  }),
  relatedTo: Joi.object({
    _id: Joi.string().hex().length(24).optional(),
    fullName: Joi.string(),
  }),
  count: Joi.number().integer().options({ convert: false }).optional(),
  balance: Joi.number().options({ convert: false }).optional(),
});
const updateInfluncerSchemaVal = Joi.object({
  id: Joi.string().hex().length(24),
  socialAccount: Joi.string().min(3).max(30).optional(),
  state: Joi.string()
    .valid(...Object.values(influencers))
    .optional(),
  coupon: Joi.string().hex().length(24).optional(),
  count: Joi.number().integer().options({ convert: false }).optional(),
  balance: Joi.number().options({ convert: false }).optional(),
});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});
export {
  requestForBenfluencerVal,
  InfluncerVal,
  updateInfluncerSchemaVal,
  paramsIdVal,
};
