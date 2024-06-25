import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { UserModel } from "../../../database/models/user.model.js";
import { ApiFetcher } from "../../utils/Fetcher.js";

const createuser = AsyncHandler(async (req, res, next) => {
  const user = new UserModel(req.body);
  await user.save();
  return res.json({ message: "sucess" });
});
const updateuser = AsyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req?.params?.id, req?.body);
  return res.json({ message: "sucess" });
});
const deleteUser = AsyncHandler(async (req, res, next) => {
  let user = req.user;
  if (user._id === req?.params?.id)
    return res.json({ message: "cann't delete your own self" });

  await UserModel.findByIdAndDelete(req?.params?.id);
  res.json({ message: "sucess" });
});
const softdelete = AsyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req?.params?.id, {
    isblocked: true,
    isActive: false,
  });
  return res.json({ message: "success" });
});
const getAllUsers = AsyncHandler(async (req, res, next) => {
  // Define the populate array, you can adjust this as per your requirements
  const populateArray = [];

  let filterObject = {};
  if (req.query.filters) {
    filterObject = req.query.filters;
  }

  let apiFetcher = new ApiFetcher(
    UserModel.find(filterObject).select("-password"),
    req.query
  );
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
  const document = await UserModel.findById({ _id: req.params.id }).select('-password');
  if (!document) return next(new AppError("user not found", 404));
  return res.status(200).json(document);
});
export {
  updateuser,
  deleteUser,
  softdelete,
  createuser,
  getAllUsers,
  findOneUser,
};
