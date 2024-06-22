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
});

const FileModel =  model("file", schema);
export default FileModel;
