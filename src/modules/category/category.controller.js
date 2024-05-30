import { categoryModel } from "../../../database/models/category.model.js";
import {
  FindAll,
  FindOne,
  InsertOne,
  deleteOne,
  updateOne,
} from "../handlers/crudHandler.js";
const Errormassage = "Category not found";
const addCategory = InsertOne(categoryModel, Errormassage, "name");
const getallCategoryies = FindAll(categoryModel, Errormassage);
const getOneCategory = FindOne(categoryModel, Errormassage);
const updateCategorty = updateOne(categoryModel, Errormassage, "name");
const deleteCategory = deleteOne(categoryModel, Errormassage);

export {
  addCategory,
  getallCategoryies,
  getOneCategory,
  updateCategorty,
  deleteCategory,
};
