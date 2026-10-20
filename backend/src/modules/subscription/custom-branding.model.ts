import mongoose from "mongoose";
import { Document } from "mongoose";


export interface ICustomBranding extends Document {
  enabled: boolean;
  userId: mongoose.Types.ObjectId;
  brandName: string;            // "Acme Corp"
  brandImageUrl: string;              // "https://cdn.example.com/logo.png"
  websiteUrl?: string;          // "https://acme.com"
  primaryColor: string;         // "#00F0FF"
  footerText: string;          // "© 2026 Acme Corp. All rights reserved."
}


const customBrandingSchema = new mongoose.Schema<ICustomBranding>({
  enabled: {
    type: Boolean,
    default: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
