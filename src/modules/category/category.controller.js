import { categoryModel } from "../../../database/models/category.model.js";
import {
  FindAll,
  FindOne,
  InsertOne,
  deleteOne,
  updateOne,
} from "../handlers/crudHandler.js";
import { ApiFetcher } from "../../utils/Fetcher.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";

const Errormassage = "Category not found";
const addCategory = InsertOne(categoryModel, Errormassage, "name");

const getallCategoryies = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements
  const populateArray = [];

  let filterObject = {};
  if (req.query.filters) {
    filterObject = req.query.filters;
  }

  let apiFetcher = new ApiFetcher(categoryModel.find(filterObject), req.query);
  apiFetcher.filter().search().sort().select();
  // Execute the modified query and get total count
  const total = await categoryModel.countDocuments(apiFetcher.queryOrPipeline);

  // Apply pagination after getting total count
  apiFetcher.pagination();

  // Execute the modified query to fetch data
  const data = await apiFetcher.queryOrPipeline.exec();

  // Calculate pagination metadata
  const pages = Math.ceil(total / apiFetcher.metadata.pageLimit);

  res.status(200).json({
    success: true,
    data,
    metadata: {
      ...apiFetcher.metadata,
      pages,
      total,
    },
  });
});


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
