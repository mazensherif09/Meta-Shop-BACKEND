import express from "express";
import {
  ForgetPasswordVal,
  authResetPasswordVal,
  signinSchemaVal,
  signupschemaVal,
  updatePasswordVal,
  updateVal,
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
  logout,
  softdelete,
  updateuser,
  deleteUser,
  changepassword,
  verfiySession,
} from "./auth.controller.js";
import { validation } from "../../middleware/globels/validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { comparePassword } from "../../middleware/auth/comparePassword.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { handleVerfiySession } from "../../middleware/auth/handleVerfiySession.js";

const AuthRouter = express.Router();
AuthRouter.post(`/signup`, validation(signupschemaVal), checkEmailuser, signUp); //sign up :)
AuthRouter.post(`/signin`, validation(signinSchemaVal), signIn); //log in :)
AuthRouter.get(`/session`, handleVerfiySession, protectedRoutes, verfiySession);
AuthRouter.get("/verify/:token", verfiyEmail); // verfiy Email :)
AuthRouter.get(`/unsubscribe/:token`, unsubscribe); // unsubscribe  :)
AuthRouter.post(`/forget-password`, validation(ForgetPasswordVal), FPsendEmail); // send email for reset password !
AuthRouter.get(`/forget-Password/:token`, protectedRoutes, tokenForgetPassword); // this optional endpoint  for front-end to loaders(react js || next js) to check token for handle layout !
AuthRouter.post(
  `/resetPassword`,
  validation(authResetPasswordVal),
  protectedRoutes,
  ResetPassword
); // reset password if token vaild

AuthRouter.post(`/logout`, protectedRoutes, logout); // log out
AuthRouter.delete("/softdelete", protectedRoutes, softdelete); // soft delete => account will be blocked (cant log in if  account blocked)
AuthRouter.put("/update-me",validation(updateVal), protectedRoutes, updateuser) // update user
AuthRouter.route(`/:id`)
  .delete(protectedRoutes, authorized(enumRoles.admin), deleteUser); // delete user
AuthRouter.put(
  `/update-password`,
  validation(updatePasswordVal),
  protectedRoutes,
  comparePassword,
  changepassword
); // reset password

//end forgot paswword routes
export { AuthRouter };
