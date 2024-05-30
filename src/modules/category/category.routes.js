import express from "express";
import {
  addCategory,
  deleteCategory,
  getOneCategory,
  getallCategoryies,
  updateCategorty,
} from "./category.controller.js";
import {
  CategorySchemaVal,
  UpdateCategorySchemaVal,
  paramsIdVal,
} from "./category.validation.js";
import { fileUploadSingle } from "../../services/FileUpload/FileUpload.js";
import { SubCategoryRouter } from "../subcategory/subCategory.routes.js";
import { PreSaveFunction } from "../../middleware/PreSave.js";
import { categoryModel } from "../../../database/models/category.model.js";
import { validation } from "../../middleware/validation.js";

const categoryRouter = express.Router();
categoryRouter.use("/:category/subcategories", SubCategoryRouter);
categoryRouter
  .route("/")
  .post(
    fileUploadSingle("img"),
    validation(CategorySchemaVal),
    PreSaveFunction(categoryModel, "category", "name", "img"),
    addCategory
  )
  .get(getallCategoryies);
categoryRouter
  .route("/:id")
  .get(validation(paramsIdVal), getOneCategory)
  .put(
    fileUploadSingle("img"),
    validation(UpdateCategorySchemaVal),
    PreSaveFunction(categoryModel, "category", "name", "img"),
    updateCategorty
  )
  .delete(validation(paramsIdVal), deleteCategory);
export { categoryRouter };
