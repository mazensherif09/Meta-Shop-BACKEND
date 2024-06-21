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
  deletePag,
  updatePage,
} from "./singleType.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";

const singleTypeRouter = express.Router();

singleTypeRouter
  .route("/")
  .post(validation(PageSchemaVal), insert)
  .get(getPage);


singleTypeRouter
  .route("/:id")
  .put(validation(updatePageSchemaVal), updatePage)
  .delete(validation(paramsIdVal), deletePag);

export default singleTypeRouter;
