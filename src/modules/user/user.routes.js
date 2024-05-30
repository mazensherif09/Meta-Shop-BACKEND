import express from "express";
import {
  ForgetPasswordVal,
  signinSchemaVal,
  signupschemaVal,
  updatePasswordVal,
  updateVal,
} from "./user.vailadtion.js";
import { checkEmailuser } from "../../middleware/checkUser.js";

import {
  FPsendEmail,
  changepassword,
  deleteUser,
  logIn,
  logout,
  shareProfile,
  signUp,
  softdelete,
  tokenForgetPassword,
  unsubscribe,
  updateuser,
  verfiyEmail,
} from "./user.controller.js";
import { comparePassword } from "../../middleware/comparePassword.js";
import { PincodeCheck } from "../../middleware/PincodeCheck.js";
import { validation } from "../../middleware/validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";

const UserRouter = express.Router();
// start registration routes
const authRoute = "/auth";

UserRouter.post(
  `${authRoute}/register`,
  validation(signupschemaVal),
  checkEmailuser,
  signUp
); //sign up

UserRouter.post(`${authRoute}/login`, validation(signinSchemaVal), logIn); //log in

UserRouter.post(`${authRoute}/logout`, protectedRoutes, logout); // log out

UserRouter.get("/verify/:token", verfiyEmail); // verfiy Email

UserRouter.get(`${authRoute}/unsubscribe/:token`, unsubscribe); // unsubscribe => delete account
// end registration routes

UserRouter.get(`${authRoute}/shareProfile`, protectedRoutes, shareProfile); // share profile as QR code

UserRouter.delete("/softdelete", protectedRoutes, softdelete); // soft delete => account will be blocked (cant log in if  account blocked)

UserRouter.route(`/${authRoute}/:id`)
  .put(validation(updateVal), protectedRoutes, updateuser) // update user
  .delete(protectedRoutes, deleteUser); // delete user

UserRouter.put(
  `${authRoute}/resetPassword`,
  validation(updatePasswordVal),
  protectedRoutes,
  comparePassword,
  changepassword
); // reset password
// start forget paswword routes

UserRouter.post(
  `${authRoute}/forgetPassword`,
  validation(ForgetPasswordVal),
  FPsendEmail
); // send email for reset password

UserRouter.get(
  `${authRoute}/forgetPassword/:token`,
  protectedRoutes,
  tokenForgetPassword
); // this optional endpoint  for front-end to loaders(react js || next js) to check token for handle layout

// UserRouter.post(
//   `${authRoute}/resetPassword`,
//   validation(authResetPasswordVal),
//   protectedRoutes,
//   PincodeCheck,
//   ResetPassword
// ); // reset password if token vaild
//end forgot paswword routes
export { UserRouter };
