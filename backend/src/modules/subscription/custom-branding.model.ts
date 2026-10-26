import mongoose from "mongoose";
import { Document } from "mongoose";


export interface ICustomBranding extends Document {
  userId: mongoose.Types.ObjectId;
  brandName: string;
  brandImageUrl: string;
  imageFileId: string;
  websiteUrl?: string;
  primaryColor: string;
  footerText: string;
}


const customBrandingSchema = new mongoose.Schema<ICustomBranding>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  brandName: {
    type: String,
    trim: true,
    maxlength: 50,
  },

  brandImageUrl: {
    type: String,
    trim: true,
  },

  imageFileId: {
    type: String,
    trim: true,
  },

  websiteUrl: {
    type: String,
  },

  primaryColor: {
    type: String,
    default: "#8B5CF6",
    match: /^#[0-9A-Fa-f]{6}$/,
  },

  footerText: {
    type: String,
    trim: true,
    maxlength: 150,
  },
}, {timestamps: true});


const customBrandingModel = mongoose.model("Branding", customBrandingSchema);
export default customBrandingModel;
