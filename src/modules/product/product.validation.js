import Joi from "joi";

const colorSchema = Joi.object({
  color: Joi.string().length(24).hex().required(), // Validate ObjectId
  images: Joi.array().items(Joi.string().length(24).hex().required()), // Validate ObjectId
  sizes: Joi.array().items(
    Joi.object({
      size: Joi.string().length(24).hex().required(), // Validate ObjectId
      stock: Joi.number().min(0).default(0),
    })
  ),
});

const ProductSchemaVal = Joi.object({
  title: Joi.string().min(3).max(300).required().trim(),
  description: Joi.string().min(15).max(1500).required(),
  price: Joi.number().min(0).required(),
  discount: Joi.number().default(0),
  quantity: Joi.number().min(0).optional(),
  category: Joi.string().hex().length(24).required(),
  colors: Joi.when("categoryType", {
    is: "clothes",
    then: Joi.array()
      .items(
        Joi.object({
          color: Joi.string().length(24).hex().required(), // Validate ObjectId
          images: Joi.array().items(Joi.string().length(24).hex().required()), // Validate ObjectId
          sizes: Joi.array()
            .items(
              Joi.object({
                size: Joi.string().length(24).hex().required(), // Validate ObjectId
                stock: Joi.number().min(0).default(0),
              })
            )
            .optional(),
        })
      )
      .optional(),
    otherwise: Joi.array().items(colorSchema).optional(),
  }),
  specs: Joi.when("categoryType", {
    is: "tech",
    then: Joi.object({
      processor: Joi.string().optional(),
      ram: Joi.string().optional(),
      storage: Joi.string().optional(),
    }).optional(),

    otherwise: Joi.forbidden(),
  }),
  categoryType: Joi.string().valid("clothes", "tech").required(),
});
const UpdateproductSchemaVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  title: Joi.string().min(3).max(300).trim().optional(),
  description: Joi.string().min(15).max(1500).optional(),
  price: Joi.number().min(0).optional(),
  discount: Joi.number().min(0).optional(),
  quantity: Joi.number().min(0).optional(),
  category: Joi.string().hex().length(24).optional(),
  colors: Joi.when("categoryType", {
    is: "clothes",
    then: Joi.array()
      .items(
        Joi.object({
          color: Joi.string().length(24).hex().required(), // Validate ObjectId
          images: Joi.array().items(Joi.string().length(24).hex().required()), // Validate ObjectId
          sizes: Joi.array()
            .items(
              Joi.object({
                size: Joi.string().length(24).hex().required(), // Validate ObjectId
                stock: Joi.number().min(0).default(0),
              })
            )
            .optional(),
        })
      )
      .optional(),
    otherwise: Joi.array().items(colorSchema).optional(),
  }),
  specs: Joi.when("categoryType", {
    is: "tech",
    then: Joi.object({
      processor: Joi.string().optional(),
      ram: Joi.string().optional(),
      storage: Joi.string().optional(),
    }).optional(),
    otherwise: Joi.forbidden(),
  }),
  categoryType: Joi.string().valid("clothes", "tech").optional(),
});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});

export { ProductSchemaVal, UpdateproductSchemaVal, paramsIdVal };
