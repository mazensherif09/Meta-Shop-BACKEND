import Joi from "joi";
import { relationFileVal } from "../file/file.validation.js";
import {
  colorSchemaVal,
  updateColorSchemaVal,
} from "../colors/colors.validation.js";
import { CategorySchemaVal } from "../category/category.validation.js";
import { subCategorySchemaVal } from "../subcategory/subcategory.validation.js";
import { updatesizeSchemaVal } from "../sizes/sizes.validation.js";
let ObjectIdVal = Joi.string().hex().length(24);
let imagesVal = Joi.array().items(
  Joi.alternatives().try(ObjectIdVal, relationFileVal)
); // Validate ObjectId
let colorVal = Joi.alternatives().try(ObjectIdVal, updateColorSchemaVal);
const sizeVal = Joi.alternatives().try(ObjectIdVal, updatesizeSchemaVal);
const clothesVal = Joi.array().items(
  Joi.object({
    color: colorVal,
    images: imagesVal,
    sizes: Joi.array().items(
      Joi.object({
        size: Joi.any(), // Validate ObjectId
        stock: Joi.number().min(0),
        _id: ObjectIdVal,
      })
    ),
    _id: ObjectIdVal,
  })
);
const decorVal = Joi.array()
  .items(
    Joi.object({
      color: colorVal,
      images: imagesVal,
      stock: Joi.number().min(0).default(0),
      _id: ObjectIdVal,
    })
  )
  .optional();
const ProductSchemaVal = Joi.object({
  _id: ObjectIdVal,
  name: Joi.string().min(1).max(300).required().trim(),
  description: Joi.string().min(15).max(1500).required(),
  price: Joi.number().min(0).required(),
  discount: Joi.number().default(0),
  quantity: Joi.number().min(0).optional(),
  isFeatured: Joi.boolean(),
  puplish: Joi.boolean(),
  poster: Joi.alternatives().try(ObjectIdVal, relationFileVal),
  category: Joi.alternatives().try(ObjectIdVal, CategorySchemaVal).required(),
  subcategory: Joi.alternatives()
    .try(ObjectIdVal, subCategorySchemaVal)
    .required(),
  type: Joi.string().valid("clothes", "decor").required(),
  colors: Joi.when("type", {
    is: "clothes",
    then: clothesVal,
    otherwise: decorVal,
  }).required(),
});
const UpdateproductSchemaVal = Joi.object({
  id: ObjectIdVal,
  name: Joi.string().min(1).max(300).trim(),
  description: Joi.string().min(1).max(1500),
  price: Joi.number().min(0),
  discount: Joi.number().default(0),
  quantity: Joi.number().min(0).optional(),
  isFeatured: Joi.boolean(),
  puplish: Joi.boolean(),
  poster: Joi.alternatives().try(ObjectIdVal, relationFileVal),
  category: Joi.alternatives().try(ObjectIdVal, CategorySchemaVal),
  subcategory: Joi.alternatives().try(ObjectIdVal, subCategorySchemaVal),
  type: Joi.string().valid("clothes", "decor"),
  colors: Joi.when("type", {
    is: "clothes",
    then: clothesVal,
    otherwise: decorVal,
  }),
  colors: Joi.alternatives().try(clothesVal, decorVal),
});
const paramsIdVal = Joi.object({
  id: ObjectIdVal,
});
const paramsSlugVal = Joi.object({
  slug: Joi.alternatives()
    .try(Joi.string().min(1).max(300).required(),
      Joi.string().hex().length(24).required())
    .required(),
});

export { ProductSchemaVal, UpdateproductSchemaVal, paramsIdVal, paramsSlugVal };
