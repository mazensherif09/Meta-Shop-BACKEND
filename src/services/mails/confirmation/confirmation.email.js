import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { confirmationLayout } from "./temaplate.js";
export const confirmEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mohamedosama10085@gmail.com",
      pass: "qcnjyqmbxgqleiwk",
    },
  });
  let token = jwt.sign({ email }, process.env.SECRETKEY);
  const info = await transporter.sendMail({
    from: '"moahmed osama" <mohamedosama10085@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Verfiy Your Email", // Subject line
    html: confirmationLayout(token).toString(), // html body
  });
};
