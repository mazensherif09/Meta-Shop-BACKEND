import express from "express";

import {
  addSubCategory,
  getAllSubCategoryies,
  getOneSubCategory,
  updateSubCategorty,
  deleteSubCategory,
} from "./subcategory.controller.js";

import {
  subCategorySchemaVal,
  UpdatesubCategorySchemaVal,
  paramsIdVal,
} from "./subcategory.validation.js";
import { validation } from "../../middleware/globels/validation.js";

const SubCategoryRouter = express.Router({ mergeParams: true });
SubCategoryRouter.route("/")
  .post(validation(subCategorySchemaVal), addSubCategory)
  .get(getAllSubCategoryies);
SubCategoryRouter.route("/:id")
  .get(validation(paramsIdVal), getOneSubCategory)
  .put(validation(UpdatesubCategorySchemaVal), updateSubCategorty)
  .delete(validation(paramsIdVal), deleteSubCategory);
export { SubCategoryRouter };
