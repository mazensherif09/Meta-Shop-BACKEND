import express from "express";
import {

  updatePasswordVal,
  updateVal,
} from "./user.vailadtion.js";

import {
  changepassword,
  deleteUser,
  logout,
  softdelete,
  updateuser,
} from "./user.controller.js";
import { comparePassword } from "../../middleware/auth/comparePassword.js";
// import { PincodeCheck } from "../../middleware/PincodeCheck.js";
import { validation } from "../../middleware/globels/validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";

const UserRouter = express.Router();
// start registration routes
UserRouter.post(`/logout`, protectedRoutes, logout); // log out
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
