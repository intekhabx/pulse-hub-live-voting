import type { Response, NextFunction } from "express";
import ApiError from "../../utils/api-error.utils";
import { verifyAccessToken, type AccessTokenPayload } from "../../utils/jwt-token.utils";
import userModel from "./auth.model";
import type { AuthRequest } from "../../types/index.types";
import asyncHandler from "../../utils/async-handler.middleware";


export const isLoggedIn = asyncHandler(async (req: AuthRequest , res: Response, next: NextFunction): Promise<void>=>{
  const authHeader = req.headers?.authorization;
  if(!authHeader) throw ApiError.unAuthorized("authorization header missing")

  let token;
  if(authHeader && authHeader.startsWith("Bearer ")){
    token = authHeader.split(" ")[1];
  }
  if(!token) throw ApiError.unAuthorized("invalid bearer token");

  const decoded = verifyAccessToken(token) as AccessTokenPayload;

  const user = await userModel.findById(decoded.id);
  if(!user) throw ApiError.unAuthorized("access token expired")

  req.user = {
    id: user._id,
    email: user.email,
    role: user.role
  }
  next();
})