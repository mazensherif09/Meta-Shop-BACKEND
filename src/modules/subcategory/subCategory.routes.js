import express from "express";
import { vaildation } from "../../middleware/vaildtaion.js";


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
} from "./subcategory.vaildation.js";

const SubCategoryRouter = express.Router({ mergeParams: true });
SubCategoryRouter.route("/")
  .post(vaildation(subCategorySchemaVal), addSubCategory)
  .get(getAllSubCategoryies);
SubCategoryRouter.route("/:id")
  .get(vaildation(paramsIdVal), getOneSubCategory)
  .put(vaildation(UpdatesubCategorySchemaVal), updateSubCategorty)
  .delete(vaildation(paramsIdVal), deleteSubCategory);
export { SubCategoryRouter };
