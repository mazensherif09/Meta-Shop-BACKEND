import express from "express";
import {
  influncerSchemaVal,
  updateInfluncerSchemaVal,
  paramsIdVal,
} from "./influncer.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import { request, GetAll, Delete, Update , GetOne} from "./influncer.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";

const influncerRouter = express.Router();

influncerRouter
  .route("/")
  .post(validation(influncerSchemaVal), request)
  .get(GetAll);

influncerRouter
  .route("/:id")
  .get(validation(paramsIdVal), GetOne)
  .put(validation(updateInfluncerSchemaVal), Update)
  .delete(validation(paramsIdVal), Delete);

export default influncerRouter;
