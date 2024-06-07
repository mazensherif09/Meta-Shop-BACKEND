import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { confirmationLayout } from "./temaplate.js";
import { transporter } from "../../../utils/sendEmail.js";
export const confirmEmail = async (email) => {
  try {
    let token = jwt.sign({ email }, process.env.SECRETKEY);
    const res = await transporter.sendMail({
      from: `"moahmed osama" <${process.env.Email_username}>`, // sender address
      to: email, // list of receivers
      subject: "Verfiy Your Email", // Subject line
      html: confirmationLayout(token).toString(), // html body
    });
    return res;
  } catch (error) {
    return error;
  }
};
