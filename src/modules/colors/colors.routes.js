import express from "express";
import {
  colorSchemaVal,
  updateColorSchemaVal,
  paramsIdVal,
} from "./colors.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import {
  Insert,
  Delete,
  GetAll,
  Update,
} from "./colors.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";

const colorsRouter = express.Router();

colorsRouter
  .route("/")
  .post(validation(colorSchemaVal), Insert)
  .get(GetAll);

colorsRouter
  .route("/:id")
  .put(validation(updateColorSchemaVal), Update)
  .delete(validation(paramsIdVal), Delete);

export default colorsRouter;
