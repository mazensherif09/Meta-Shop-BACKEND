import jwt from "jsonwebtoken";
import qrcode from "qrcode";
import bcrypt from "bcrypt";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { UserModel } from "../../../database/models/user.model.js";



const logout = AsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  await UserModel.findByIdAndUpdate(_id, { isActive: false });
  return res.json({ message: "success" });
});
const changepassword = AsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  let token = jwt.sign({ user: _id }, process.env.SECRETKEY);
  await UserModel.findByIdAndUpdate(_id, {
    password: bcrypt.hashSync(req.body.newpassword, 8),
    passwordChangedAt: Date.now(),
  });

  res.json({ message: "success", token });
});
const updateuser = AsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  await UserModel.findByIdAndUpdate(_id, req.body);
  return res.json({ message: "sucess" });
});
const deleteUser = AsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  await UserModel.findByIdAndDelete(_id);
  return res.json({ message: "sucess" });
});
const softdelete = AsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  await UserModel.findByIdAndUpdate(_id, {
    isblocked: true,
    isActive: false,
  });
  return res.json({ message: "success" });
});
// const shareProfile = AsyncHandler(async (req, res, next) => {
//   const { _id } = req.user;
//   qrcode.toDataURL(`http://localhost:3000/messages/${_id}`, function (err, qr) {
//     return res.send(`<img src="${qr}"/>`);
//   });
// });
export {
  logout,
  changepassword,
  updateuser,
  deleteUser,
  softdelete,
};
