import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { forgetPasswordLayout } from "./template.js";
export const forPasswordEmail = async (email, Pincode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mohamedosama10085@gmail.com",
      pass: "qcnjyqmbxgqleiwk",
    },
  });

  let token = jwt.sign({ email }, process.env.SECRETKEY, { expiresIn: "15m" });

  const info = await transporter.sendMail({
    from: '"moahmed osama" <mohamedosama10085@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Forget Your Password ?", // Subject line
    html: forgetPasswordLayout(token, Pincode).toString(), // html body
  });
};
