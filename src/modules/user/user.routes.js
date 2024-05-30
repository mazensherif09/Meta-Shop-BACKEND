import express from "express";
import {
  ForgetPasswordVal,
  authResetPasswordVal,
  signinSchemaVal,
  signupschemaVal,
  updatePasswordVal,
  updateVal,
} from "./user.vailadtion.js";
import { checkEmailuser } from "../../middleware/checkUser.js";

import {
  FPsendEmail,
  ResetPassword,
  changepassword,
  deleteUser,
  logIn,
  logout,
  shareProfile,
  sighnUp,
  softdelete,
  tokenForgetPassword,
  unsubscribe,
  updateuser,
  verfiyEmail,
} from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
import { comparePassword } from "../../middleware/comparePassword.js";
import { authToken } from "../../middleware/authToken.js";
import { PincodeCheck } from "../../middleware/PincodeCheck.js";
import { vaildation } from "../../middleware/vaildtaion.js";

const UserRouter = express.Router();
// start registration routes
const authRoute = "/auth";
UserRouter.post(`${authRoute}/register`,
  vaildation(signupschemaVal),
  checkEmailuser,
  sighnUp
); //sign up
UserRouter.post(`${authRoute}/login`, vaildation(signinSchemaVal), logIn); //log in
UserRouter.post(`${authRoute}/logout`, auth, logout); // log out
UserRouter.get("/verify/:token", verfiyEmail); // verfiy Email
UserRouter.get(`${authRoute}/unsubscribe/:token`, unsubscribe); // unsubscribe => delete account
// end registration routes
UserRouter.get(`${authRoute}/shareProfile`, auth, shareProfile); // share profile as QR code
UserRouter.delete("/softdelete", auth, softdelete); // soft delete => account will be blocked (cant log in if  account blocked)
UserRouter.route(`/${authRoute}/:id`)
  .put(vaildation(updateVal), auth, updateuser) // update user
  .delete(auth, deleteUser); // delete user
UserRouter.put(
  `${authRoute}/resetPassword`,
  vaildation(updatePasswordVal),
  auth,
  comparePassword,
  changepassword
); // reset password
// start forget paswword routes
UserRouter.post(
  `${authRoute}/forgetPassword`,
  vaildation(ForgetPasswordVal),
  FPsendEmail
); // send email for reset password
UserRouter.get(
  `${authRoute}/forgetPassword/:token`,
  authToken,
  tokenForgetPassword
); // this optional endpoint  for front-end to loaders(react js || next js) to check token for handle layout
UserRouter.post(
  `${authRoute}/resetPassword`,
  vaildation(authResetPasswordVal),
  authToken,
  PincodeCheck,
  ResetPassword
); // reset password if token vaild
//end forgot paswword routes
export { UserRouter };
