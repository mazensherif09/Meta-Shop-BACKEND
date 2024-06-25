import express from "express";
import {
  PageSchemaVal,
  updatePageSchemaVal,
  paramsIdVal,
} from "./singleType.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import {
  insert,
  getPage,
  updatePage,
} from "./singleType.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";

const singleTypeRouter = express.Router();

singleTypeRouter
  .route("/")
  .post(protectedRoutes, authorized(enumRoles.admin), insert);

singleTypeRouter
  .route("/:id")
  .get(validation(paramsIdVal), getPage)
  .put(
    validation(paramsIdVal),
    protectedRoutes,
    authorized(enumRoles.admin),
    updatePage
  )

export default singleTypeRouter;
