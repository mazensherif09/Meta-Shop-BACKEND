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
// import { PincodeCheck } from "../../middleware/PincodeCheck.js";
import { validation } from "../../middleware/validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";

const UserRouter = express.Router();
// start registration routes
UserRouter.post(`/logout`, protectedRoutes, logout); // log out
UserRouter.get(`/shareProfile`, protectedRoutes, shareProfile); // share profile as QR code
UserRouter.delete("/softdelete", protectedRoutes, softdelete); // soft delete => account will be blocked (cant log in if  account blocked)
UserRouter.route(`/:id`)
  .put(validation(updateVal), protectedRoutes, updateuser) // update user
  .delete(protectedRoutes, deleteUser); // delete user
UserRouter.put(
  `/resetPassword`,
  validation(updatePasswordVal),
  protectedRoutes,
  comparePassword,
  changepassword
); // reset password
export { UserRouter };
