import joi from "joi";

const createOrderVal = joi.object({
  id : joi.string().length(24).hex().required(),
  shippingAddress: joi.object({
    street: joi.string().trim().required(),
    city: joi.string().trim().required(),
    phone: joi.string().trim().required(),
  }).required(),
});

export { createOrderVal };
