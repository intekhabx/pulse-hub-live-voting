import mongoose, { Document } from "mongoose";


export interface IContact extends Document{
  name: string;
  email: string;
  subject: string;
  message: string;
}

const contactSchema = new mongoose.Schema<IContact>({
  name: {
    type: String,
    trim: true,
    required: [true, "name is required"],
    minlength: 2,
    maxlength: 95
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "email is required"],
    maxlength: 322
  },
  subject: {
    type: String,
    required: [true, "subject is required"],
    minLength: 5,
    maxLength: 150,
  },
  message: {
    type: String,
    minLength:10,
    required: [true, "message is required"],
    maxlength: 1000,
  }
}, {timestamps: true});




const contactModel = mongoose.model('Contact', contactSchema);
export default contactModel;
