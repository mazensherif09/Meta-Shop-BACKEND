import express from "express";
import {
  addCategory,
  deleteCategory,
  getOneCategory,
  getallCategoryies,
  updateCategorty,
} from "./category.controller.js";
import { vaildation } from "./../../middleware/vaildtaion.js";
import {
  CategorySchemaVal,
  UpdateCategorySchemaVal,
  paramsIdVal,
} from "./category.vaildation.js";
import { fileUploadSingle } from "../../services/FileUpload/FileUpload.js";
import { SubCategoryRouter } from "../subcategory/subCategory.routes.js";
import { PreSaveFunction } from "../../middleware/PreSave.js";
import { categoryModel } from "../../../database/models/category.model.js";

const categoryRouter = express.Router();
categoryRouter.use("/:category/subcategories", SubCategoryRouter);
categoryRouter
  .route("/")
  .post(
    fileUploadSingle("img"),
    vaildation(CategorySchemaVal),
    PreSaveFunction(categoryModel, "category", "name", "img"),
    addCategory
  )
  .get(getallCategoryies);
categoryRouter
  .route("/:id")
  .get(vaildation(paramsIdVal), getOneCategory)
  .put(
    fileUploadSingle("img"),
    vaildation(UpdateCategorySchemaVal),
    PreSaveFunction(categoryModel, "category", "name", "img"),
    updateCategorty
  )
  .delete(vaildation(paramsIdVal), deleteCategory);
export { categoryRouter };
