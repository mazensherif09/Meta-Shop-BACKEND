import express from "express";
import { sizeSchemaVal, updatesizeSchemaVal, paramsIdVal } from "./sizes.validation.js";
import { validation } from "../../middleware/globels/validation.js";
import {
    addSize,
    getSizes,
    updateSize,
    deleteSize,
    getOne
} from "./sizes.controller.js";

import { protectedRoutes } from "../../middleware/auth/protectedRoutes.js";

const sizesRouter = express.Router();

sizesRouter
  .route("/")
  .post(validation(sizeSchemaVal), addSize)
  .get(getSizes);

sizesRouter
  .route("/:id")
  .get(getOne)
  .put(validation(updatesizeSchemaVal), updateSize)
  .delete(validation(paramsIdVal), deleteSize);

export default sizesRouter;
