import crypto from 'crypto';
import ApiError from "../../utils/api-error.utils";
import ApiResponse from "../../utils/api-response.utils";
import asyncHandler from '../../utils/async-handler.middleware';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, type RefreshTokenPayload } from "../../utils/jwt-token.utils";
import userModel from "./auth.model";

import { type NextFunction, type Request, type Response } from "express";
import type { IRegisterUser, ILoginUser, AuthRequest } from '../../types/index.types';
import { sendOtpOnEmail } from '../../services/email/email.service';
import redis from '../../config/redis.config';


function makeTokenHash(token: string){
  return crypto.createHash('sha256').update(token).digest('hex');
}

function generateOtp(){
  return crypto.randomInt(100000, 1000000).toString(); //it give me always 6 digit random string (100000 to 999999)
}





export const register = asyncHandler(async (req: Request, res:Response)=>{
  // step:1 - extract payloadData from body and check user already exists or not
  const {name, email, password}: IRegisterUser = req.body;

  const isMatch = await userModel.findOne({email});
  if(isMatch) throw ApiError.conflict("user already registered");

  // step:2 - if the user is new then create a new user with the data
  await userModel.create({
    name,
    email,
    password,
  })

  // step:3 - generate otp and also make that hashed
  const otp = generateOtp();
  const hashedOtp = makeTokenHash(otp);

  // step:4 - hashedOtp store in the redis
  const data = JSON.stringify({otp_hash: hashedOtp, purpose: "email_verification", attempts: 0});
  await redis.set(`otp:${email}`, data, "EX", 900); //15min
  
  // step:5 - send the otp to the user email
  await sendOtpOnEmail({otp, email});

  ApiResponse.created(res, "user registered successfully, Please verify your email");
})



export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  // step:1 - extract otp and the user email from the body
  const {otp, email} = req.body;

  // step:2 - find the hashed otp stored in the redis
  const rawStoredOtpData = await redis.get(`otp:${email}`);
  if(!rawStoredOtpData){
    throw ApiError.unAuthorized("The OTP has expired or is invalid");
  }
  const storedOtpData = JSON.parse(rawStoredOtpData);

  // step:3 - make otp hased and compared with stored otp
  const hashedOtp = makeTokenHash(otp);
  if(hashedOtp !== storedOtpData.otp_hash && storedOtpData.purpose === "email_verification"){
    throw ApiError.unAuthorized("The OTP you entered is incorrect");
  }

  // step:4 - now the otp is right then marks the user as verified
  await userModel.findOneAndUpdate({email}, {
    email_verified: true
  });

  // step:5 - delete the otp from redis DB so it can't be reused
  await redis.del(`otp:${email}`);

  ApiResponse.ok(res, "Email verified successfully");
})



export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  // step1: - Extract email from body
  const { email } = req.body;

  // step:2 - Check if user exists and email is already verified
  const user = await userModel.findOne({ email });
  if (!user) {
    throw ApiError.unAuthorized("No account found with this email. Please create an account first.");
  }

  if (user.email_verified) {
    throw ApiError.badRequest("This email is already verified. No OTP resend is required.");
  }

  // step:3 - Check when the previous OTP was generated
  const key = `otp:${email}`;
  const ttl = await redis.ttl(key);

  // Initial TTL = 900 seconds // If TTL > 840, less than 60 seconds have passed
  if (ttl > 840) {
    throw ApiError.badRequest("Please wait one minute before requesting another OTP.");
  }

  // step:4 - Generate a new OTP
  const otp = generateOtp();
  const hashedOtp = makeTokenHash(otp);

  // step:5 - Store the new OTP with 15-minute TTL - it modify the old data if present in redis with same key
  const data = JSON.stringify({otp_hash: hashedOtp, purpose: "email_verification",attempts: 0});
  await redis.set(key, data, "EX", 900);

  // step:6 - Send OTP to email
  await sendOtpOnEmail({ email, otp });

  ApiResponse.ok(res, "A new OTP has been sent to your email.");
});



export const login = asyncHandler(async (req:Request, res:Response)=>{
  // step:1 - extract user crediantials from body
  const {email, password}:ILoginUser = req.body;

  // step:2 - find user and verify that user email is verified or not
  const user = await userModel.findOne({email}).select('+password');
  if(!user) throw ApiError.unAuthorized("invalid user credientials");

  if(!user.email_verified){
    throw ApiError.unAuthorized("Please first verify your email");
  }

  // step:3 - now email is verified then check the user password
  const verify = await user.comparePassword(password);
  if(!verify) throw ApiError.unAuthorized("invalid user credientials");

  // step:4 - generate access and refresh token and hasedRefreshtoken store in DB
  const accessToken = generateAccessToken({id: user._id, role: user.role});
  const refreshToken = generateRefreshToken({id: user._id})

  const hashedRefreshToken = makeTokenHash(refreshToken);

  user.refreshToken = hashedRefreshToken;
  await user.save({validateBeforeSave: false});

  // step:5 - add refreshtoken in the cookies
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 //7days
  })

  // step:6 - send user details and access token to the frontend
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



export const getUserSession = asyncHandler(async(req: AuthRequest, res: Response)=> {
  // step:1 - extract cookie of the user
  const anonymousId = req?.signedCookies?.anonymousId;
  const refreshToken = req?.cookies?.refreshToken;

  // step:2 - if user cookie has refreshToken then user is already authenticated
  if(refreshToken){
    return ApiResponse.ok(res, "authenticated user");
  }

  // step:3 - if user has anonymousId then anonymous user has some id proof
  if(anonymousId){
    return ApiResponse.ok(res, "user has their anonymous id");
  }

  // step:4 - if user doesn't have anything then generate a randomId
  const newAnonymousId = crypto.randomUUID();

  // step:5 - add anonymoudId in httpOnly cookie with longed lived time
  res.cookie("anonymousId", newAnonymousId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 365, //1 year,
    signed: true, //ye cookie me ek sign add krdeta h agar koi modify krke bhejega to signedCookie me pta chal jayega
  })

  ApiResponse.ok(res, "anonymousId generated and attached");
})