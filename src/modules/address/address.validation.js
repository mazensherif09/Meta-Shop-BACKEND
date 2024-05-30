import joi from "joi";

const addAddressVal = joi.object({
  street: joi.string().required().trim(),
  phone: joi.string().required().trim(),
  city: joi.string().required().trim(),
});

const updateAddressVal = joi.object({
  id: joi.string().length(24).hex().required(),
  street: joi.string().trim(),
  phone: joi.string().trim(),
  city: joi.string().trim(),
});

const paramsIdVal = joi.object({
  id: joi.string().length(24).hex().required(),
});

export { addAddressVal, paramsIdVal, updateAddressVal };
