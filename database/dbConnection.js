import mongoose from "mongoose";

export const dbConnection = async () => {
  return await mongoose.connect(process.env.DB_URL).then(() => {
    console.log("database runned");
  });
};
