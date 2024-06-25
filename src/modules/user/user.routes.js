import express from "express";
import { updatePasswordVal, updateVal } from "./user.vailadtion.js";

import {
  updateuser,
  deleteUser,
  softdelete,
  createuser,
  getAllUsers,
} from "./user.controller.js";
import { validation } from "../../middleware/globels/validation.js";
import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";

const UserRouter = express.Router();
// start registration routes
UserRouter.route("/")
  .post(
    protectedRoutes,
    authorized(enumRoles.admin),
    validation(updateVal),
    createuser
  )
  .get(getAllUsers);
UserRouter.route("/:id")
  .put(validation(updateVal), updateuser) // update user
  .delete(protectedRoutes, authorized(enumRoles.admin), deleteUser); // delete user

export { UserRouter };
