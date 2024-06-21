import Joi from "joi";

const ProductSchemaVal = Joi.object({
  title: Joi.string().min(3).max(300).required().trim(),
  description: Joi.string().min(15).max(1500).required(),
  price: Joi.number().min(0).required(),
  discount: Joi.number().default(0),
  sold: Joi.number().default(0),
  isFeatured: Joi.boolean(),
  puplish: Joi.boolean(),
  imgcover: Joi.string(), // Assuming images are represented as strings
  discount: Joi.number().min(0).optional(),
  quantity: Joi.number().min(0).optional(),
  // category: Joi.string().hex().length(24).required(),
  poster: Joi.string().hex().length(24).optional(),
  colors: Joi.array().items(
      Joi.object({
        color: Joi.string().hex().length(24).required(),
        images: Joi.array().items().max(8).optional(),
        sizes: Joi.array().items(
            Joi.object({
              size: Joi.string().hex().length(24).required(),
              stock: Joi.number().default(0).required(),
            })
          )
          .label("size"),
      }).label("color")
    )
    .optional(),


});
const UpdateproductSchemaVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  title: Joi.string().min(3).max(300).trim().optional(),
  description: Joi.string().min(15).max(1500).optional(),
  category: Joi.string().hex().length(24).optional(),
  brand: Joi.string().hex().length(24).optional(),
  subcategory: Joi.string().hex().length(24).optional(),
  price: Joi.number().min(0).optional(),
  discount: Joi.number().min(0).optional(),

});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});

export { ProductSchemaVal, UpdateproductSchemaVal, paramsIdVal };
