import express from "express";
import {
  PageSchemaVal,
  updatePageSchemaVal,
  paramsIdVal,
} from "./singleType.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { insert, getPage, updatePage } from "./singleType.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";

const singleTypeRouter = express.Router();

singleTypeRouter.post(
  "/landing",
  protectedRoutes,
  authorized(enumRoles.admin),
  insert
);
singleTypeRouter.post(
  "/about-us",
  protectedRoutes,
  authorized(enumRoles.admin),
  insert
);
singleTypeRouter.post(
  "/warning",
  protectedRoutes,
  authorized(enumRoles.admin),
  insert
);

singleTypeRouter
  .route("/:key")
  .put(protectedRoutes, authorized(enumRoles.admin), updatePage)
  .get(getPage);

export default singleTypeRouter;
