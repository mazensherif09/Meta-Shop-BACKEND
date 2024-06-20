import mongoose, { Schema, model, models } from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  createdBy: { type: ObjectId, ref: "user" },
});

const colorModel = model("color", schema);
export default colorModel;
