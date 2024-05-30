import jwt from "jsonwebtoken";

import qrcode from "qrcode";
import bcrypt from "bcrypt";
import { AsyncHandler } from "../../middleware/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { forPasswordEmail } from "./../../services/mails/forgetPassword/forgetPassword.Email.js";
import { confirmEmail } from "./../../services/mails/confirmation/confirmation.email.js";
import { UserModel } from "../../../database/models/user.model.js";

const sighnUp = AsyncHandler(async (req, res, next) => {
  confirmEmail(req.body.email);
  const user = new UserModel(req.body);

  await user.save(); //save the user body after updating
  let token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_KEY
  );

  return res.json({
    state: "success",
    message: "we sent verfiy massage to your email please confirm your email",
    token,
  });
});

const logIn = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let user = await UserModel.findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    if (user?.isblocked) return res.json({ message: "User is blocked" });

    const { _id } = user;
    if (user?.confirmEmail) {
      await UserModel.findByIdAndUpdate(_id, { isActive: true });

      let token = jwt.sign({ user: _id }, process.env.SECRETKEY);

      return res.json({ message: "Success", token });
    } else {
      confirmEmail(email);
      next(new AppError(`Can not log in without verfiy email`, 401));
    }
  } else {
    return next(new AppError(`Incorrect email or password`, 401));
  }
});

const logout = AsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  await UserModel.findByIdAndUpdate(_id, { isActive: false });
  return res.json({ message: "success" });
});

const verfiyEmail = AsyncHandler(async (req, res, next) => {
  jwt.verify(req.params.token, process.env.SECRETKEY, async (err, decoded) => {
    if (err) return next(new AppError(err, 401));
    const user = await UserModel.findOneAndUpdate(
      { email: decoded.email },
      { confirmEmail: true }
    );
    if (!user) return next(new AppError(`user not found`, 401));
    if (user.confirmEmail)
      return next(new AppError(`email Already verified`, 401));
    return res.json({ message: "success" });
  });
});

const unsubscribe = AsyncHandler(async (req, res, next) => {
  jwt.verify(req.params.token, process.env.SECRETKEY, async (err, decoded) => {
    if (err) return next(new AppError(err, 401));
    const user = await UserModel.findOne({ email: decoded.email });
    if (!user) return next(new AppError(`user not found`, 401));
    if (user?.confirmEmail)
      return next(new AppError(`email Already verified`, 401));
    await UserModel.findOneAndDelete({ email: decoded.email });
    return res.json({ message: " now your not subscribe" });
  });
});
const changepassword = AsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  let token = jwt.sign({ user: _id }, process.env.JWT_KEY);
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
const shareProfile = AsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  qrcode.toDataURL(`http://localhost:3000/messages/${_id}`, function (err, qr) {
    return res.send(`<img src="${qr}"/>`);
  });
});
const FPsendEmail = AsyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const findUser = await UserModel.findOne({ email });
  if (!findUser) return next(new AppError(`user not found`, 401));
  if (findUser?.isblocked) return next(new AppError("user is blocked", 401));
  const pincode = Math.floor(Math.random() * 9000 + 100000); // to generate random pin code 6 digits
  forPasswordEmail(email, pincode);
  await UserModel.findByIdAndUpdate(findUser._id, {
    Pincode: pincode,
    isresetPassword: true,
  });
  return res.json({ message: `We sent email to ${email} ` });
});
const tokenForgetPassword = AsyncHandler(async (req, res, next) => {
  return res.json({ message: "vaild token" });
});
const ResetPassword = AsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  let token = jwt.sign({ user: _id }, process.env.JWT_KEY);
  await UserModel.findByIdAndUpdate(_id, {
    password: bcrypt.hashSync(req.body.newpassword, 8),
    passwordChangedAt: Date.now(),
  });
  return res.json({ message: " Password updated successfully", token });
});
export {
  sighnUp,
  shareProfile,
  logIn,
  logout,
  verfiyEmail,
  changepassword,
  updateuser,
  deleteUser,
  softdelete,
  unsubscribe,
  ResetPassword,
  FPsendEmail,
  tokenForgetPassword,
};
