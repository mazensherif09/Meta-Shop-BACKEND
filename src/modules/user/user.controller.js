import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { UserModel } from "../../../database/models/user.model.js";

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
  await UserModel.findByIdAndDelete(req?.params?.id);
  return res.json({ message: "sucess" });
});
const softdelete = AsyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req?.params?.id, {
    isblocked: true,
    isActive: false,
  });
  return res.json({ message: "success" });
});
const getAllUsers = AsyncHandler(async (req, res, next) => {
  const users = await UserModel.find();
  return res.json({ message: "sucess", users });
 })
export {  updateuser, deleteUser, softdelete,createuser,getAllUsers };
