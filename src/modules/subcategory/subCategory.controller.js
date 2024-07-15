import { SubCategoryModel } from "./../../../database/models/subcategory.model.js";
import {
  FindAll,
  FindOne,
  InsertOne,
  deleteOne,
  updateOne,
} from "../handlers/crudHandler.js";
import { ApiFetcher } from "../../utils/Fetcher.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";

const Errormassage = " Category not found";

const addsubCategory = InsertOne(
  SubCategoryModel,
  "can't create Category with name already exsit ",
  "name"
);
const getAllsubCategoryies = FindAll(SubCategoryModel);
const getOnesubCategory = FindOne(SubCategoryModel, Errormassage);
const updateSubCategorty = updateOne(
  SubCategoryModel,
  "can't create Category with name already exsit ",
  "name",
);
const deletesubCategory = deleteOne(SubCategoryModel, Errormassage);
export {
  addsubCategory,
  getAllsubCategoryies,
  getOnesubCategory,
  updateSubCategorty,
  deletesubCategory,
};
