import mongoose, { Schema, Document, Model } from "mongoose";

// Enum for user roles
export enum UserRole {
  OWNER = "owner",
  TENANT = "tenant",
}

// Interface for TypeScript
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  properties?: mongoose.Types.ObjectId[]; // Only for owners
  rentedProperties?: mongoose.Types.ObjectId[]; // Only for tenants
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.TENANT,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property", // Reference to Property model (for Owners)
      },
    ],
    rentedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property", // Reference to Property model (for Tenants)
      },
    ],
  },
  { timestamps: true }
);

// Export User model
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
