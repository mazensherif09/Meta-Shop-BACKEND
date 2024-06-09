import mongoose from "mongoose";
import { Roles_permissions } from "../../src/assets/enums/Roles_permissions.js";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [2, "too short category name"],
    },
    roles: [
      {
        name: {
          type: String,
          unique: [true, "name is required"],
          trim: true,
          required: true,
          minLength: [2, "too short category name"],
        },
        permissions: [{ type: String, enum: Object.values(Roles_permissions), default: "user" }],
      },
    ],
    createdBy: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

export const UserRoleModel = mongoose.model("user_roles", schema);

/*
{
table: "users",
feilds:[{
name:,
roles:[]
}]
}
*/
