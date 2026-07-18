import jwt from 'jsonwebtoken';
import ApiError from './api-error.utils';
import type mongoose from 'mongoose';

export interface AccessTokenPayload {
  id: mongoose.Types.ObjectId,
  role: string,
}

export interface RefreshTokenPayload {
  id: mongoose.Types.ObjectId,
}

const accessSecret = process.env.JWT_ACCESS_TOKEN;
const refreshSecret = process.env.JWT_REFRESH_TOKEN;

export const generateAccessToken = (payload: AccessTokenPayload)=>{
  if(!accessSecret){
    throw ApiError.unAuthorized("ACCESS TOKEN is missing");
  }

  return jwt.sign(payload, accessSecret, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  })
}


export const verifyAccessToken = (token: string)=>{
  if(!accessSecret){
    throw ApiError.unAuthorized("ACCESS TOKEN is invalid or missing");
  }
  try {
    return jwt.verify(token, accessSecret);
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unAuthorized("Access token expired");
    } else if (error.name === 'JsonWebTokenError') {
      throw ApiError.unAuthorized("Invalid access token");
    } else {
      throw ApiError.unAuthorized("Token verification failed");
    }
  }
}



export const generateRefreshToken = (payload: RefreshTokenPayload)=>{
  if(!refreshSecret){
    throw ApiError.unAuthorized("REFRESH TOKEN is missing");
  }

  return jwt.sign(payload, refreshSecret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  })
}

export const verifyRefreshToken = (token: string)=>{
  if(!refreshSecret){
    throw ApiError.unAuthorized("REFRESH TOKEN is invalid or missing");
  }
  try {
    return jwt.verify(token, refreshSecret);
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unAuthorized("Refresh token expired");
    } else if (error.name === 'JsonWebTokenError') {
      throw ApiError.unAuthorized("Invalid refresh token");
    } else {
      throw ApiError.unAuthorized("Token verification failed");
    }
  }
}