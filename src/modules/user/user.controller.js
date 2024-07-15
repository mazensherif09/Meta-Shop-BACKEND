import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { ApiFetcher } from "../../utils/Fetcher.js";
import { enumRoles } from "../../assets/enums/Roles_permissions.js";
import { AppError } from "../../utils/AppError.js";
import { UserModel } from "../../../database/models/user.model.js";
import httpStatus from "../../assets/messages/httpStatus.js";
const createuser = AsyncHandler(async (req, res, next) => {
  let cheackUser = await UserModel.findOne({
    email: req.body.email,
    _id: {
      $ne: req?.params?.id,
    },
  });
  if (cheackUser)
    return next(
      new AppError(
        responseHandler("conflict", undefined, "user already exists")
      )
    );
  const user = new UserModel(req.body);
  await user.save();
  return res.json({
    message: "sucess",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isblocked: user.isblocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      createdBy: { fullName: req.user.fullName, _id: req.user._id },
    },
  });
});
const updateuser = AsyncHandler(async (req, res, next) => {
  if (req.body.email) {
    let user = await UserModel.findOne({
      email: req.body.email,
      _id: {
        $ne: req?.params?.id,
      },
    });
    if (user) return next(new AppError(responseHandler("conflict", "email")));
  }

  let data = await UserModel.findByIdAndUpdate(req?.params?.id, req?.body)
    .populate("createdBy", "fullName")
    .select("-password");
  if (!data) next(new AppError(responseHandler("NotFound", "user")));
  data = {
    ...data?._doc,
    updatedBy: { fullName: req.user.fullName, _id: req.user._id },
  };
  return res.status(200).json({ message: "Updated Sucessfully", data });
});
const deleteUser = AsyncHandler(async (req, res, next) => {
  let user = req.user;
  if (user._id === req?.params?.id)
    return res.json({ message: "cann't delete your own self" });

  await UserModel.findByIdAndDelete(req?.params?.id);
  res.json({ message: "sucess" });
});
const getAllUsers = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements
  const populateArray = [];

  let filterObject = {};
  if (!req?.query?.filters?.role) {
    filterObject = {
      role: { $eq: enumRoles.user },
    };
  }

  // Exclude the current user from the query
  filterObject._id = { $ne: req.user._id };

  let apiFetcher = new ApiFetcher(UserModel.find(filterObject), req.query);
  apiFetcher.filter().search().sort().select();

  // Execute the modified query and get total count
  const total = await UserModel.countDocuments(apiFetcher.queryOrPipeline);

  // Apply pagination after getting total count
  apiFetcher.pagination();

  // Execute the modified query to fetch data
  const data = await apiFetcher.queryOrPipeline.exec();

  // Calculate pagination metadata
  const pages = Math.ceil(total / apiFetcher.metadata.pageLimit);

  res.status(200).json({
    success: true,
    data,
    metadata: {
      ...apiFetcher.metadata,
      pages,
      total,
    },
  });
});
const findOneUser = AsyncHandler(async (req, res, next) => {
  if (req?.user?._id?.toString() === req?.params?.id.toString()) {
    if (!document) return next(new AppError(httpStatus.NotFound));
  }
  const document = await UserModel.findById({ _id: req.params.id })
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName")
    .select("-password");
  if (!document) return next(new AppError(httpStatus.NotFound));
  return res.status(200).json(document);
});
export { updateuser, deleteUser, createuser, getAllUsers, findOneUser };
