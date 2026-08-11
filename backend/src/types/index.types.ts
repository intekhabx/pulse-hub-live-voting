import mongoose from "mongoose"
import type { Request } from "express"

// for register
export interface IRegisterUser{
  name: string,
  email: string,
  password: string
}

// for login
export interface ILoginUser{
  email: string,
  password: string
}

// for req.user
export interface AuthRequest extends Request {
  user?: {
    id: mongoose.Types.ObjectId,
    email: string,
    role: string,
  }
}


export interface IRecentActivityData {
  pollId: string;
  pollTitle: string;
  message: string;
  icon: "response" | "publish" | "expire" | "create" | "delete" | "update";
}


export interface IPoll {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string | null;
  createdBy?: mongoose.Types.ObjectId | string | null;
  questions: {
    _id: mongoose.Types.ObjectId;
    questionText: string;
    required: boolean;
    options: {
      _id: mongoose.Types.ObjectId;
      optionText: string;
    }[];
  }[];
  allowAnonymous: boolean;
  status: "active" | "draft";
  expiresAt?: Date | string | null;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
