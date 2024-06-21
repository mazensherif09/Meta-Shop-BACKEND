import express from "express";
import {
  colorSchemaVal,
  updateColorSchemaVal,
  paramsIdVal,
} from "./colors.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import {
  addColor,
  deleteColor,
  getColors,
  updateColor,
} from "./colors.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";

const colorsRouter = express.Router();

colorsRouter
  .route("/")
  .post(validation(colorSchemaVal), addColor)
  .get(getColors);

colorsRouter
  .route("/:id")
  .put(validation(updateColorSchemaVal), updateColor)
  .delete(validation(paramsIdVal), deleteColor);

export default colorsRouter;
