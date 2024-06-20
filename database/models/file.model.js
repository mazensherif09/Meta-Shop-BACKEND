import mongoose, { Schema, model, models } from "mongoose";

const schema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const fileModel =  model("file", schema);
export default fileModel;
