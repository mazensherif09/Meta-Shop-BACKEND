import express from "express";

import {
  updateuser,
  deleteUser,
  softdelete,
  createuser,
  getAllUsers,
  findOneUser,
} from "./user.controller.js";
import { validation } from "../../middleware/globels/validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import {userVal} from './user.vailadtion.js'
import { checkEmailuser } from "../../middleware/auth/checkUser.js";
const UserRouter = express.Router();
// start registration routes
UserRouter.route("/")
  .post(
    protectedRoutes,
    authorized(enumRoles.admin),
    validation(userVal),
    checkEmailuser,
    createuser
  )
  .get(getAllUsers);
UserRouter.route("/:id")
  .get(protectedRoutes, authorized(enumRoles.admin), findOneUser)
  .put(validation(userVal), updateuser) // update user
  .delete(protectedRoutes, authorized(enumRoles.admin), deleteUser); // delete user

export { UserRouter };
