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

const UserRouter = express.Router();
// start registration routes
UserRouter.route("/").post(validation(updateVal), createuser).get(getAllUsers);
UserRouter.route("/:id").put(validation(updateVal),  updateuser) // update user
.delete(deleteUser); // delete user

export { UserRouter };
