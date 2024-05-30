import Joi from "joi";

const ProductSchemaVal = Joi.object({
  image: Joi.object({
    fieldname: Joi.string(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    mimetype: Joi.string().valid("image/jpeg", "image/png"),
    size: Joi.number().max(5242880),
    destination: Joi.string(),
    filename: Joi.string(),
    path: Joi.string(),
  }),
  title: Joi.string().min(3).max(300).required().trim(),
  description: Joi.string().min(15).max(1500).required(),
  category: Joi.string().hex().length(24).required(),
  brand: Joi.string().hex().length(24).required(),
  subcategory: Joi.string().hex().length(24).required(),
  price: Joi.number().min(0).required(),
  discount: Joi.number().min(0).optional(),
  quantity: Joi.number().min(0),
  imgCover: Joi.array()
    .items(
      Joi.object({
        fieldname: Joi.string(),
        originalname: Joi.string(),
        encoding: Joi.string(),
        mimetype: Joi.string().valid("image/jpeg", "image/png"),
        size: Joi.number().max(5242880),
        destination: Joi.string(),
        filename: Joi.string(),
        path: Joi.string(),
      }).required()
    )
    .required(),
  images: Joi.array()
    .items(
      Joi.object({
        fieldname: Joi.string(),
        originalname: Joi.string(),
        encoding: Joi.string(),
        mimetype: Joi.string().valid("image/jpeg", "image/png"),
        size: Joi.number().max(5242880),
        destination: Joi.string(),
        filename: Joi.string(),
        path: Joi.string(),
      })
    )
    .required(),
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
  imgCover: Joi.array().items(
    Joi.object({
      fieldname: Joi.string(),
      originalname: Joi.string(),
      encoding: Joi.string(),
      mimetype: Joi.string().valid("image/jpeg", "image/png"),
      size: Joi.number().max(5242880),
      destination: Joi.string(),
      filename: Joi.string(),
      path: Joi.string(),
    })
  ),
  images: Joi.array().items(
    Joi.object({
      fieldname: Joi.string(),
      originalname: Joi.string(),
      encoding: Joi.string(),
      mimetype: Joi.string().valid("image/jpeg", "image/png"),
      size: Joi.number().max(5242880),
      destination: Joi.string(),
      filename: Joi.string(),
      path: Joi.string(),
    })
  ),
  removepermission: Joi.alternatives().conditional(Joi.string(), {
    then: Joi.string().hex().length(24),
    otherwise: Joi.array().items(Joi.string().hex().length(24)),
  }),
  addpermission: Joi.alternatives().conditional(Joi.string(), {
    then: Joi.string().hex().length(24),
    otherwise: Joi.array().items(Joi.string().hex().length(24)),
  }),
  havePermission: Joi.array().items(Joi.string().hex().length(24)),
});
const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});

export { ProductSchemaVal, UpdateproductSchemaVal, paramsIdVal };
