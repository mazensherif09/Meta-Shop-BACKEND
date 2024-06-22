import Joi from "joi";

const clothesVal = Joi.array().items(
  Joi.object({
    color: Joi.string().length(24).hex(), // Validate ObjectId
    images: Joi.array().items(Joi.string().length(24).hex()), // Validate ObjectId
    sizes: Joi.array().items(
      Joi.object({
        size: Joi.string().length(24).hex().required(), // Validate ObjectId
        stock: Joi.number().min(0),
      })
    ),
  })
);
const decorVal = Joi.array()
  .items(
    Joi.object({
      color: Joi.string().length(24).hex().required(), // Validate ObjectId
      images: Joi.array().items(Joi.string().length(24).hex().required()), // Validate ObjectId
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
  category: Joi.string().valid("clothes", "decor").required(),
  isFeatured: Joi.boolean(),
  puplish: Joi.boolean(),
  colors: Joi.when("category", {
    is: "clothes",
    then: clothesVal,
    otherwise: decorVal,
  }).optional(),
});
const UpdateproductSchemaVal = Joi.object({
  id: Joi.string().hex().length(24),
  title: Joi.string().min(3).max(300).required().trim(),
  description: Joi.string().min(15).max(1500),
  price: Joi.number().min(0).required(),
  discount: Joi.number().default(0),
  quantity: Joi.number().min(0).optional(),
  isFeatured: Joi.boolean(),
  puplish: Joi.boolean(),
  category: Joi.string().valid("clothes", "decor"),
  colors: Joi.when("category", {
    is: "clothes",
    then: clothesVal,
    otherwise: decorVal,
  }).optional(),
});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});
const paramsSlugVal = Joi.object({
  slug: Joi.string().min(3).max(300).required(),
});

export { ProductSchemaVal, UpdateproductSchemaVal, paramsIdVal, paramsSlugVal };
