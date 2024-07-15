import { colorModel } from "../../../database/models/color.model.js";
import httpStatus from "../../assets/messages/httpStatus.js";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne, FindAll } from "../handlers/crudHandler.js";

const Insert = AsyncHandler(async (req, res, next) => {
  const checkdata = await colorModel.findOne({
    $or: [
      {
        name: req.body?.name,
      },
      {
        code: req.body?.code,
      },
    ],
  });
  if (checkdata)
    return next(
      new AppError({ message: `color is already exsist`, code: 401 })
    );

  req.body.createdBy = req.user._id;
  let data = new colorModel(req.body);
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
const Update = AsyncHandler(async (req, res, next) => {
  if (req.body?.name || req.body?.code) {
    const queryForCheck = {
      _id: { $ne: req.params?.id },
      $or: [],
    };
    if (req.body?.name) {
      queryForCheck.$or.push({ name: req.body.name });
    }
    if (req.body?.code) {
      queryForCheck.$or.push({ code: req.body.code });
    }
    if (queryForCheck.$or.length > 0) {
      const checkdata = await colorModel.findOne(queryForCheck);

      if (checkdata) {
        return next(
          new AppError({ message: `Color is already exist`, code: 401 })
        );
      }
    }
  }
  let data = await colorModel
    .findByIdAndUpdate(req.params?.id, req.body, { new: true })
    .populate("createdBy", "fullName");
  if (!data) next(new AppError(httpStatus.NotFound));
  data = {
    ...data?._doc,
    updatedBy: { fullName: req.user.fullName, _id: req.user._id },
  };
  return res.status(200).json({
    message: "Updated Sucessfully",
    data,
  });
});
const getOne = AsyncHandler(async (req, res, next) => {
  const data = await colorModel
    .findById(req.params?.id)
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");
  if (!data) next(new AppError(httpStatus.NotFound));

  res.status(200).json(data);
});

const GetAll = FindAll(colorModel);

const Delete = deleteOne(colorModel);



export { Insert, GetAll, Delete, Update, getOne };
