import Joi from "joi";

const signupschemaVal = Joi.object({
  fullName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("password")).required(),
});
const signinSchemaVal = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    .required(),
});
const ForgetPasswordVal = Joi.object({
  email: Joi.string().email().required(),
});
const authResetPasswordVal = Joi.object({
  token: Joi.string().min(100).max(400).required(),
  newPassword: Joi.string()
    .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("newPassword")).required(),

});
export {
  ForgetPasswordVal,
  authResetPasswordVal,
  signinSchemaVal,
  signupschemaVal,
};
