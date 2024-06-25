import express from "express";
import {
  sizeSchemaVal,
  updatesizeSchemaVal,
  paramsIdVal,
} from "./sizes.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import {
  addSize,
  getSizes,
  updateSize,
  deleteSize,
  getOne,
} from "./sizes.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";

const sizesRouter = express.Router();

sizesRouter
  .route("/")
  .post(
    validation(sizeSchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    addSize
  )
  .get(getSizes);

sizesRouter
  .route("/:id")
  .get(getOne)
  .put(
    validation(updatesizeSchemaVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    updateSize
  )
  .delete(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    deleteSize
  );

export default sizesRouter;
