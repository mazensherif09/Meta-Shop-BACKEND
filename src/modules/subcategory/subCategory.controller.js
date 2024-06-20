import { SubCategoryModel } from "./../../../database/models/subcategory.model.js";
import {
  FindAll,
  FindOne,
  InsertOne,
  deleteOne,
  updateOne,
} from "../handlers/crudHandler.js";
const Errormassage = " Category not found";
const addSubCategory = InsertOne(
  SubCategoryModel,
  "can't create Category with name already exsit ",
  "name",
  true
);
const getAllSubCategoryies = FindAll(
  SubCategoryModel,
  Errormassage,
  "category",
  ["category"]
);
const getOneSubCategory = FindOne(SubCategoryModel, Errormassage);
const updateSubCategorty = updateOne(SubCategoryModel, Errormassage);
const deleteSubCategory = deleteOne(SubCategoryModel, Errormassage);
export {
  addSubCategory,
  getAllSubCategoryies,
  getOneSubCategory,
  updateSubCategorty,
  deleteSubCategory,
};
