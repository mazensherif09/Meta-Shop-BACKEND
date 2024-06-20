import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { forgetPasswordEmail } from "../../services/mails/forgetPassword/forgetPassword.Email.js";
import { confirmEmail } from "../../services/mails/confirmation/confirmation.email.js";
import { UserModel } from "../../../database/models/user.model.js";
import { generateSecurePin } from "../../utils/genratePinCode.js";

const signUp = AsyncHandler(async (req, res, next) => {
  const email = await confirmEmail(req.body.email);
  const user = new UserModel(req.body);
  await user.save(); // save the user body after updating
  let token = jwt.sign(
    { id: user?._id, role: user?.role },
    process.env.SECRETKEY
  );
  return res.json({
    state: "success",
    message: "we sent verfiy massage to your email please confirm your email",
    token,
  });
});
const signIn = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let user = await UserModel.findOne({ email });
  if (user && bcrypt.compareSync(password, user.password)) {
    if (user?.isblocked) return res.json({ message: "User is blocked" });
    const { _id } = user;
    if (user?.confirmEmail) {
      await UserModel.findByIdAndUpdate(_id, { isActive: true });
      let token = jwt.sign(
        { id: user?._id, role: user?.role },
        process.env.SECRETKEY
      );
      return res.json({ message: "Success", token });
    } else {
      next(new AppError(`Can not sign in without verfiy email`, 401));
    }
  } else {
    return next(new AppError(`Incorrect email or password`, 401));
  }
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
const FPsendEmail = AsyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const findUser = await UserModel.findOne({ email });
  if (!findUser) return next(new AppError(`user not found`, 401));
  if (findUser?.isblocked) return next(new AppError("user is blocked", 401));
  const securePin = generateSecurePin(6);
  const { success } = await forgetPasswordEmail(email, securePin);
  if (!success)
    return next(new AppError(`something wrong try again later`, 401));
  await UserModel.findByIdAndUpdate(findUser._id, {
    pincode: securePin,
    isresetPassword: true,
  });
  return res.json({ message: `We sent email to ${email} ` });
});
const tokenForgetPassword = AsyncHandler(async (req, res, next) => {
  return res.json({ message: "vaild token" });
});
const ResetPassword = AsyncHandler(async (req, res, next) => {
  if (req.user.Pincode !== req.body.pincode)
    return next(new AppError("pin code is incorrect", 401));
  const { _id } = req.user;
  let token = jwt.sign({ user: _id }, process.env.SECRETKEY);
  await UserModel.findByIdAndUpdate(_id, {
    password: bcrypt.hashSync(req.body.newpassword, 8),
    passwordChangedAt: Date.now(),
  });
  return res.json({ message: " Password updated successfully", token });
});
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
export {
  signUp,
  signIn,
  logout,
  updateuser,
  deleteUser,
  softdelete,
  verfiyEmail,
  unsubscribe,
  FPsendEmail,
  ResetPassword,
  changepassword,
  tokenForgetPassword,
};
