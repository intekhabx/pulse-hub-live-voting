import crypto from 'crypto';
import ApiError from "../../utils/api-error.utils";
import ApiResponse from "../../utils/api-response.utils";
import asyncHandler from '../../utils/async-handler.middleware';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, type RefreshTokenPayload } from "../../utils/jwt-token.utils";
import userModel from "./auth.model";

import { type NextFunction, type Request, type Response } from "express";
import type { IRegisterUser, ILoginUser, AuthRequest } from '../../types/index.types';


function makeTokenHash(token: string){
  return crypto.createHash('sha256').update(token).digest('hex');
}


export const register = asyncHandler(async (req: Request, res:Response)=>{
  const {name, email, password}: IRegisterUser = req.body;

  const isMatch = await userModel.findOne({email});
  if(isMatch) throw ApiError.conflict("user already registered");

  await userModel.create({
    name,
    email,
    password,
  })

  ApiResponse.created(res, "user registered successfully");
})


export const login = asyncHandler(async (req:Request, res:Response)=>{
  const {email, password}:ILoginUser = req.body;

  const user = await userModel.findOne({email}).select('+password');
  if(!user) throw ApiError.unAuthorized("invalid user credientials");

  const verify = await user.comparePassword(password);
  if(!verify) throw ApiError.unAuthorized("invalid user credientials");

  const accessToken = generateAccessToken({id: user._id, role: user.role});
  const refreshToken = generateRefreshToken({id: user._id})

  const hashedRefreshToken = makeTokenHash(refreshToken);

  user.refreshToken = hashedRefreshToken;
  await user.save({validateBeforeSave: false});

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 //7days
  })

  const userObj = {
    name: user.name,
    email: user.email,
    role: user.role,
    userId: user._id
  }

  ApiResponse.ok(res, "user logged in successfully", {user: userObj, accessToken})
})


export const logout = asyncHandler(async(req: AuthRequest, res:Response)=>{
  const userId = req.user?.id;
  await userModel.findByIdAndUpdate(userId, {$unset: {refreshToken: ""}});

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  });

  ApiResponse.ok(res, "user logged-out successfully")
})


export const renewToken = asyncHandler(async (req: Request, res: Response, next: NextFunction)=>{
  // step:1 - refreshToken comes form req.cookie.refreshToken , we check it is missing or not
  const refreshToken = req.cookies?.refreshToken;
  if(!(refreshToken && refreshToken.trim())) throw ApiError.unAuthorized("invalid or missing refresh token");

  // step:2 - verifyRefreshToken, to ensure, it is genereated through our secret
  const decoded = verifyRefreshToken(refreshToken) as RefreshTokenPayload;
  // we find user with decoded value, if user found then it is right
  const user = await userModel.findById(decoded.id).select("+refreshToken");
  if(!user) throw ApiError.unAuthorized("invalid refresh token");

  // step:3 - make refresh token hashed to compare both refreshToken
  const hashedRefreshToken = makeTokenHash(refreshToken);
  if(hashedRefreshToken !== user.refreshToken){
    throw ApiError.unAuthorized("Invalid refresh token");
  }

  // step:4 - now user is authorized, genereate newAccessToken and newRefeshToken
  const newAccessToken = generateAccessToken({id: user._id, role: user.role});
  const newRefreshToken = generateRefreshToken({id: user._id});

  // step:5 - newHashedRefreshToken store in DB
  const newHashedRefreshToken = makeTokenHash(newRefreshToken);
  user.refreshToken = newHashedRefreshToken;
  await user.save({validateBeforeSave: false});

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 //7days
  })

  ApiResponse.ok(res, "token refreshed successfully", {accessToken: newAccessToken})
})