import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";


export interface IUser extends Document{
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";

  refreshToken: string;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;

  comparePassword(plainTextPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    trim: true,
    required: [true, "name is required"],
    minlength: 2,
    maxlength: 95
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, "email is required"],
    maxlength: 322
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: 8,
    maxlength: 66,
    select: false,
  },
  role:{
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  refreshToken: {
    type: String,
    select: false,
  },
  verificationToken: {type: String, select: false},
  resetPasswordToken: {type: String, select: false},
  resetPasswordTokenExpires: {type: Date, select: false},
}, {timestamps: true})


//save hased password in db whenever password field will modify
userSchema.pre('save', async function(){
  if(!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
})

//method to compare plain and hashedPassword
userSchema.methods.comparePassword = async function(plainTextPassword:string): Promise<boolean>{
  return await bcrypt.compare(plainTextPassword, this.password);
}


const userModel = mongoose.model('User', userSchema);
export default userModel;
