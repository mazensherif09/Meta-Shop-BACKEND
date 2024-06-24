import Joi from "joi";

const uploadSchema = Joi.object({
  files: Joi.array()
    .items(
      Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        destination: Joi.string(),
        path: Joi.string(),
        filename: Joi.string(),
        mimetype: Joi.string()
          .valid("image/jpeg", "image/png", "image/gif")
          .required(),
        size: Joi.number()
          .max(1024 * 1024 * 10)
          .required(), // 10 MB size limit
      }).required()
    )
    .required(),
});

const deleteSchema = Joi.object({
  id: Joi.string().required(),
});

const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});
export { uploadSchema, paramsIdVal, deleteSchema };
