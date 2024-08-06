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
  softdelete,
  updateuser,
  deleteUser,
  changepassword,
  verfiySession,
  logOut,
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
AuthRouter.get(`/logout`, logOut); // log out
// AuthRouter.get("/verify/:token", verfiyEmail); // verfiy Email :)
// AuthRouter.get(`/unsubscribe/:token`, unsubscribe); // unsubscribe  :)
// AuthRouter.post(`/forget-password`, validation(ForgetPasswordVal), FPsendEmail); // send email for reset password !
// AuthRouter.get(`/forget-Password/:token`, protectedRoutes, tokenForgetPassword); // this optional endpoint  for front-end to loaders(react js || next js) to check token for handle layout !
AuthRouter.post(
  `/resetPassword`,
  validation(authResetPasswordVal),
  protectedRoutes,
  ResetPassword
);
AuthRouter.route("/me")
  .put(validation(updateVal), protectedRoutes, updateuser)
  .get(handleVerfiySession, protectedRoutes, verfiySession)
  .delete(protectedRoutes, deleteUser) // delete user
  .patch(
    validation(updatePasswordVal),
    protectedRoutes,
    comparePassword,
    changepassword
  )
//end forgot paswword routes
export { AuthRouter };
