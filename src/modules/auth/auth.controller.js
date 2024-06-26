import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AsyncHandler } from "../../middleware/globels/AsyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { forgetPasswordEmail } from "../../services/mails/forgetPassword/forgetPassword.Email.js";
import { confirmEmail } from "../../services/mails/confirmation/confirmation.email.js";
import { UserModel } from "../../../database/models/user.model.js";
import { cartModel } from "../../../database/models/cart.model.js";
import { generateSecurePin } from "../../utils/genratePinCode.js";
import {
  handleMerageCartItems,
  handleproductIsAvailable,
} from "../../middleware/cart/handleCart.js";

const signUp = AsyncHandler(async (req, res, next) => {
  const user = new UserModel(req.body);
  await user.save(); // save the user body after updating

  jwt.verify(req.cookies.cart, process.env.SECRETKEY, async (err, decoded) => {
    if (decoded?.cart) {
      await cartModel.findByIdAndUpdate(decoded?.cart, { user: user._id });
    }
  });

  let token = jwt.sign(
    { _id: user?._id, role: user?.role },
    process.env.SECRETKEY
  );
  res.cookie("token", token, {
    maxAge: 365 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  // Fetch the updated cart details
  let updatedCart = await cartModel.findOne({ user: user._id });

  return res.status(200).json({
    message: `welcome ${user?.fullName}`,
    data: {
      _id: user?._id,
      fullName: user?.fullName,
      email: user?.email,
      role: user?.role,
      phone: user?.phone,
    },
    cart: updatedCart,
  });
});
const signIn = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let user = await UserModel.findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    if (user?.isblocked) return res.json({ message: "User is blocked" });
    res.cookie(
      "token",
      jwt.sign({ _id: user?._id, role: user?.role }, process.env.SECRETKEY, {
        expiresIn: 365 * 24 * 60 * 60 * 1000,
      }),
      {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      }
    );

    let cart = null;
    jwt.verify(
      req.cookies.cart,
      process.env.SECRETKEY,
      async (err, decoded) => {
        if (decoded?.cart) {
          cart = await cartModel.findById(decoded?.cart, { user: user._id });
        }
      }
    );
    let loaclItems = await handleproductIsAvailable(items);
    let allItems = handleMerageCartItems(loaclItems, cart?.items);

    let updatedCart = await cartModel.findByIdAndUpdate(cart._id, {
      items: allItems,
    });

    return res.status(200).json({
      message: `welcome ${user.fullName}`,
      data: {
        _id: user?._id,
        fullName: user?.fullName,
        email: user?.email,
        role: user?.role,
        phone: user?.phone,
      },
      cart: updatedCart,
    });
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
    return res.status(200).json({ message: "success" });
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
    return res.status(200).json({ message: " now your not subscribe" });
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
  return res.status(200).json({ message: `We sent email to ${email} ` });
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
  return res.status(200).json(token);
});
const logout = AsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  await UserModel.findByIdAndUpdate(_id, { isActive: false });
  return res.json({ message: "success" });
});
const changepassword = AsyncHandler(async (req, res, next) => {
  const user = req.user;
  await UserModel.findByIdAndUpdate(_id, {
    password: bcrypt.hashSync(req.body.newpassword, 8),
    passwordChangedAt: Date.now(),
  });
  res.cookie(
    "token",
    jwt.sign({ _id: user?._id, role: user?.role }, process.env.SECRETKEY, {
      expiresIn: 365 * 24 * 60 * 60 * 1000,
    }),
    {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    }
  );
  return res.status(200).json({ message: "sucess" });
});
const updateuser = AsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const data = await UserModel.findByIdAndUpdate(_id, req.body).select(
    "-password"
  );
  return res.status(200).json({ message: "sucess", data });
});
const deleteUser = AsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  await UserModel.findByIdAndDelete(_id);
  return res.status(200).json({ message: "sucess" });
});
const softdelete = AsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  await UserModel.findByIdAndUpdate(_id, {
    isblocked: true,
    isActive: false,
  });
  return res.status(200).json({ message: "success" });
});
const verfiySession = AsyncHandler(async (req, res, next) => {
  const user = req.user;

  return res.status(200).json({
    _id: user?._id,
    fullName: user?.fullName,
    email: user?.email,
    role: user?.role,
    phone: user?.phone,
    confirmEmail: user?.confirmEmail,
  });
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
  verfiySession,
  ResetPassword,
  changepassword,
  tokenForgetPassword,
};
