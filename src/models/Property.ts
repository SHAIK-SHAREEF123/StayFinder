import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./UserModel";

// Enum for property status
export enum PropertyStatus {
  AVAILABLE = "available",
  RENTED = "rented",
  MAINTENANCE = "maintenance",
}

// Interface for TypeScript
export interface IProperty extends Document {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  rent: number;
  images?: string[];
  owner: mongoose.Types.ObjectId | IUser; // Owner reference
  tenant?: mongoose.Types.ObjectId | IUser; // Tenant reference
  status: PropertyStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Property Schema
const PropertySchema: Schema<IProperty> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Property description is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    rent: {
      type: Number,
      required: [true, "Rent amount is required"],
    },
    images: [
      {
        type: String, // URLs or paths to images
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: Object.values(PropertyStatus),
      default: PropertyStatus.AVAILABLE,
    },
  },
  { timestamps: true }
);

// Export Property model
const Property: Model<IProperty> = mongoose.model<IProperty>("Property", PropertySchema);
export default Property;
