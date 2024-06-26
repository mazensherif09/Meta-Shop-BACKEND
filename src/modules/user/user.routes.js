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
import { userVal , userUpdateVal} from "./user.vailadtion.js";
import { checkEmailuser } from "../../middleware/auth/checkUser.js";
import { setUserIds } from "../../middleware/setUserIds.js";
const UserRouter = express.Router();
// start registration routes
UserRouter.route("/")
  .post(
    validation(userVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    setUserIds,
    checkEmailuser,
    createuser
  )
  .get(protectedRoutes, authorized(enumRoles.admin), getAllUsers);
UserRouter.route("/:id")
  .get(protectedRoutes, authorized(enumRoles.admin), findOneUser)
  .put(
    validation(userUpdateVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    setUserIds,
    updateuser
  ) // update user
  .delete(protectedRoutes, authorized(enumRoles.admin), deleteUser); // delete user

export { UserRouter };
