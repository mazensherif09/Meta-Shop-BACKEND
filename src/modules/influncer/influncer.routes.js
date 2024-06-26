import express from "express";
import {
  influncerSchemaVal,
  updateInfluncerSchemaVal,
  paramsIdVal,
} from "./influncer.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import {
  request,
  GetAll,
  Delete,
  Update,
  GetOne,
} from "./influncer.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";
import { authorized } from "../../middleware/globels/authorized.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AttributedTo } from "../../middleware/AttributedTo.js";

const influncerRouter = express.Router();

influncerRouter
  .route("/")
  .post(validation(influncerSchemaVal), protectedRoutes, request)
  .get(protectedRoutes, authorized(enumRoles.admin), AttributedTo, GetAll);

influncerRouter
  .route("/:id")
  .get(protectedRoutes, GetOne)
  .put(
    validation(updateInfluncerSchemaVal),
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

export default influncerRouter;
