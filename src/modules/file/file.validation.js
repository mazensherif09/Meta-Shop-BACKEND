import Joi from "joi";

const uploadSchema = Joi.object({
  files: Joi.array()
    .items(
      Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid("image/jpeg", "image/png", "image/gif").required(),
        // size: Joi.number().max(1024 * 1024).required(), // 1 MB size limit
      })
    )
    .max(30)
    .required(),
});
const UpdateFiles = Joi.object({
  name: Joi.string().min(3).max(30).trim().optional(),
  id: Joi.string().hex().length(24).required(),
  files: Joi.array().items(
    Joi.object({
      fieldname: Joi.string().required(),
      originalname: Joi.string().required(),
      encoding: Joi.string().required(),
      mimetype: Joi.string()
        .valid("image/jpeg", "image/png", "image/gif")
        .required(),
      buffer: Joi.binary().required(),
      // size: Joi.number().max(1024 * 1024).required(), // 1 MB size limit
    })
  ).optional(),
});

const deleteSchema = Joi.object({
  public_id: Joi.string().required(),
});

const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24),
});
export { uploadSchema, UpdateFiles, paramsIdVal, deleteSchema };
