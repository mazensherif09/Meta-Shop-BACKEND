import express from "express";
import {
  influncerSchemaVal,
  updateInfluncerSchemaVal,
  paramsIdVal,
} from "./influncer.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import {
  request,
  getInfluncer,
  deleteInfluncer,
  updateInfluncer,
} from "./influncer.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";

const influncerRouter = express.Router();

influncerRouter
  .route("/")
  .post(validation(influncerSchemaVal), request)
  .get(getInfluncer);


influncerRouter
  .route("/:id")
  .put(validation(updateInfluncerSchemaVal), updateInfluncer)
  .delete(validation(paramsIdVal), deleteInfluncer);

export default influncerRouter;
