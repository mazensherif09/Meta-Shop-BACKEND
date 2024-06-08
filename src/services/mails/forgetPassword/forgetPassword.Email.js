import jwt from "jsonwebtoken";
import { forgetPasswordLayout } from "./template.js";
import { transporter } from "../../../utils/sendEmail.js";
export const forgetPasswordEmail = async (email, Pincode) => {
  try {
    let token = jwt.sign({ email }, process.env.SECRETKEY, {
      expiresIn: "15m",
    });
    const data = await transporter.sendMail({
      from: `"moahmed osama" <${process.env.Email_username}>`, // sender address
      to: email, // list of receivers
      subject: "Forget Your Password ?", // Subject line
      html: forgetPasswordLayout(token, Pincode).toString(), // html body
    });
    return {
      message: `We sent email to ${email} `,
      data,
      success: true,
    };
  } catch (error) {
    return {
      message: error?.message || "some thing went wrong try again later.",
      data: error,
      success: false,
    };
  }
};
