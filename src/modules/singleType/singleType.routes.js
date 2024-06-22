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

singleTypeRouter.route("/").post(insert);

singleTypeRouter
  .route("/:id")
  .get(validation(paramsIdVal), getPage)
  .put(validation(paramsIdVal), updatePage)
  .delete(validation(paramsIdVal), deletePag);

export default singleTypeRouter;
