import mongoose, { Schema, model } from "mongoose";

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
},{
  timestamps: true,
});
export const FileModel =  model("file", schema);

