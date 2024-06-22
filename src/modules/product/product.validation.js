import Joi from "joi";
let ObjectIdVal = Joi.string().hex().length(24);
const clothesVal = Joi.array().items(
  Joi.object({
    color: ObjectIdVal, // Validate ObjectId
    images: Joi.array().items(ObjectIdVal), // Validate ObjectId
    sizes: Joi.array().items(
      Joi.object({
        size: ObjectIdVal.required(), // Validate ObjectId
        stock: Joi.number().min(0),
      })
    ),
  })
);
const decorVal = Joi.array()
  .items(
    Joi.object({
      color: ObjectIdVal.required(), // Validate ObjectId
      images: Joi.array().items(ObjectIdVal.required()), // Validate ObjectId
      stock: Joi.number().min(0).default(0),
    })
  )
  .optional();
const ProductSchemaVal = Joi.object({
  title: Joi.string().min(3).max(300).required().trim(),
  description: Joi.string().min(15).max(1500).required(),
  price: Joi.number().min(0).required(),
  discount: Joi.number().default(0),
  quantity: Joi.number().min(0).optional(),
  isFeatured: Joi.boolean(),
  puplish: Joi.boolean(),
  category: ObjectIdVal,
  subcategory: ObjectIdVal,
  product_Type: Joi.string().valid("clothes", "decor"),
  colors: Joi.when("category", {
    is: "clothes",
    then: clothesVal,
    otherwise: decorVal,
  }).optional(),
});
const UpdateproductSchemaVal = Joi.object({
  id: ObjectIdVal,
  title: Joi.string().min(3).max(300).required().trim(),
  description: Joi.string().min(15).max(1500).required(),
  price: Joi.number().min(0).required(),
  discount: Joi.number().default(0),
  quantity: Joi.number().min(0).optional(),
  isFeatured: Joi.boolean(),
  puplish: Joi.boolean(),
  category: ObjectIdVal,
  subcategory: ObjectIdVal,
  type: Joi.string().valid("clothes", "decor"),
  colors: Joi.when("category", {
    is: "clothes",
    then: clothesVal,
    otherwise: decorVal,
  }).optional(),
});
const paramsIdVal = Joi.object({
  id: ObjectIdVal,
});
const paramsSlugVal = Joi.object({
  slug: Joi.alternatives().try(
    Joi.string().min(3).max(300).required(),
    Joi.string().hex().length(24).required()
  ).required()
});

export { ProductSchemaVal, UpdateproductSchemaVal, paramsIdVal, paramsSlugVal };
