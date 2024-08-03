import { sizeModel } from "../../../database/models/size.model.js";
import httpStatus from "../../assets/messages/httpStatus.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import responseHandler from "../../utils/responseHandler.js";
import { deleteOne, FindAll, FindOne } from "../handlers/crudHandler.js";

const Errormassage = "size not found";

const addSize = AsyncHandler(async (req, res, next) => {
  const checkDocument = await sizeModel.findOne({ name: req.body?.name });
  if (checkDocument)
    return next(
      new AppError(
        responseHandler("conflict", undefined, `Name is already in use`)
      )
    );

  req.body.createdBy = req.user._id;
  let data = new sizeModel(req.body);
  await data.save();
  data = {
    ...data?._doc,
    createdBy: { fullName: req.user.fullName, _id: req.user._id },
  };
  return res.status(200).json({
    message: "Added Sucessfully",
    data,
  });
});

const updateSize = AsyncHandler(async (req, res, next) => {
  let data = await sizeModel
    .findByIdAndUpdate({ _id: req.params?.id }, req.body)
    .populate("createdBy", "fullName")

  if (!data) next(new AppError(responseHandler("NotFound", "size")));
  data = {
    ...data?._doc,
    updatedBy: { fullName: req.user.fullName, _id: req.user._id },
  };
  return res.status(200).json({
    message: "Updated Sucessfully",
    data,
  });
});

const getSizes = FindAll(sizeModel);
const getOne = FindOne(sizeModel, Errormassage)
const deleteSize = deleteOne(sizeModel);

export { addSize, getSizes, deleteSize, updateSize, getOne };
