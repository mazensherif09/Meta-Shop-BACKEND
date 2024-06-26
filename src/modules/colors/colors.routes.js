import express from "express";
import {
  colorSchemaVal,
  updateColorSchemaVal,
  paramsIdVal,
} from "./colors.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { Insert, Delete, GetAll, Update, getOne } from "./colors.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/AttributedTo.js";

const colorsRouter = express.Router();

colorsRouter
  .route("/")
  .post(
    validation(colorSchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    Insert
  )
  .get(GetAll);

colorsRouter
  .route("/:id")
  .get(getOne)
  .put(
    validation(updateColorSchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    Update
  )
  .delete(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    AttributedTo,
    Delete
  );

export default colorsRouter;
