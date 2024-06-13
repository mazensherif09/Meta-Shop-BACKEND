import Joi from "joi";


const ForgetPasswordVal = Joi.object({
  email: Joi.string().email().required(),
});
const updateVal = Joi.object({
  fullName: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  age: Joi.number().integer().min(10).max(80),
 
});
const updatePasswordVal = Joi.object({
  newpassword: Joi.string()
    .pattern(/^[A-Z][a-z0-9#@]{8,30}$/)
    .required(),
  currentpassword: Joi.string()
    .pattern(/^[A-Z][a-z0-9#@]{8,30}$/)
    .required(),
  
});
const authResetPasswordVal = Joi.object({
  token: Joi.string().min(100).max(400).required(),
  newPassword: Joi.string()
    .pattern(/^[A-Z][a-z0-9#@]{8,30}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("newPassword")).required(),
 
});
export {
  ForgetPasswordVal,
  updateVal,
  updatePasswordVal,
  authResetPasswordVal,
};
