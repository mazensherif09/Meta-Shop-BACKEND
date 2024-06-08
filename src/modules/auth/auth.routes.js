import express from "express";
import {
  ForgetPasswordVal,
  authResetPasswordVal,
  signinSchemaVal,
  signupschemaVal,
} from "./auth.vailadtion.js";
import { checkEmailuser } from "../../middleware/auth/checkUser.js";

import {
  signUp,
  signIn,
  verfiyEmail,
  unsubscribe,
  FPsendEmail,
  tokenForgetPassword,
  ResetPassword,
} from "./auth.controller.js";
import { comparePassword } from "../../middleware/auth/comparePassword.js";
import { validation } from "../../middleware/globels/validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";

const AuthRouter = express.Router();
AuthRouter.post(`/signup`, validation(signupschemaVal), checkEmailuser, signUp); //sign up :)
AuthRouter.post(`/signin`, validation(signinSchemaVal), signIn); //log in :)
AuthRouter.get("/verify/:token", verfiyEmail); // verfiy Email !
AuthRouter.get(`/unsubscribe/:token`, unsubscribe); // unsubscribe => delete account !
// end registration routes
AuthRouter.post(`/forgetPassword`, validation(ForgetPasswordVal), FPsendEmail); // send email for reset password !
AuthRouter.get(`/forgetPassword/:token`, protectedRoutes, tokenForgetPassword); // this optional endpoint  for front-end to loaders(react js || next js) to check token for handle layout !
AuthRouter.post(
  `/resetPassword`,
  validation(authResetPasswordVal),
  protectedRoutes,
  ResetPassword
); // reset password if token vaild
//end forgot paswword routes
export { AuthRouter };
