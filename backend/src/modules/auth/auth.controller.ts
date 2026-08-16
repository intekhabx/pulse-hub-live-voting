import crypto from 'crypto';
import ApiError from "../../utils/api-error.utils";
import ApiResponse from "../../utils/api-response.utils";
import asyncHandler from '../../utils/async-handler.middleware';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, type RefreshTokenPayload } from "../../utils/jwt-token.utils";
import userModel from "./auth.model";

import { type NextFunction, type Request, type Response } from "express";
import type { IRegisterUser, ILoginUser, AuthRequest } from '../../types/index.types';
import { googleOAuth2Client } from '../../config/google.config';
import { google } from 'googleapis';
import redis from '../../config/redis.config';
import type { IGithubEmail, IGithubTokenResponse, IGithubUser } from '../../types/github.types';


function makeTokenHash(token: string){
  return crypto.createHash('sha256').update(token).digest('hex');
}

function generateOtp(){
  return crypto.randomInt(100000, 1000000).toString(); //it give me always 6 digit random string (100000 to 999999)
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



// gogle OAuth login***
export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  // step:1 - this function creates a authorization_url with client_id, scope, redirect_uri etc...
  const googleAuthUrl = googleOAuth2Client.generateAuthUrl({
    access_type: "offline", // user jab offline ho jaye to v uske behalf pe refresh_token ka use kar sake google API ke saath
    scope: ["openid", "email", "profile"],
    prompt: "select_account" //User ko account selection screen dikhao email ka choose krne ke liye agar ek se jyda email h to
  });

  // step:2 - redirect to the authorization_endpoint through our backend
  // console.log(googleAuthUrl);
  res.redirect(googleAuthUrl);
})



export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  // step:1 - extract the short_code from the query that is coming from google
  const {code} = req.query;

  if (!code || typeof code !== "string") {
    throw ApiError.badRequest("Google authorization code is missing");
  }

  // step:2 - send the short_code, client_secret to the google and get tokens (client_secret, client_id and redirect_uri saath me send ho rha h jo hmne googleOAuth2Client config krte hue diya tha)
  const { tokens } = await googleOAuth2Client.getToken(code);
  // console.log(tokens);

  // step:3 - Set the received tokens on the OAuth client.
  // This is NOT required for Google login.
  // It is only needed if we want to use the OAuth client later
  // to make authenticated requests to other Google services/APIs. like calender , gmail etc.
  googleOAuth2Client.setCredentials(tokens);

  // step:4 - get the authenticated user profile details
  const oauth2 = google.oauth2({
    auth: googleOAuth2Client,
    version: "v2",
    // we have already set the credentials in googleOAuth2Client so we don't need to send access_token explicitly
  });

  const { data } = await oauth2.userinfo.get();
  // console.log(data);
  if (!data || !data.email || !data.id || !data.name) {
    throw ApiError.unAuthorized("Unable to retrieve Google user information");
  }

  // step:5 - find the user with the email that user exists or not
  let user = await userModel.findOne({ email: data.email });
  if (!user) {
    user = await userModel.create({
      name: data.name,
      email: data.email,
      authProvider: "google",
      providerId: data.id,
    });
  }

  // step:6 - genereate refreshtoken for the user and hasedRefreshtoken store in the DB
  // if we send user and access_token as json then frontend doens't redirect to dashboard; frontend just shows the json data
  // so we only send the refreshtoken in cookie and a otp in query and frontend came with that otp and then wwe send the access_token because we can't send access_token (body data) with redirect
  const refreshToken = generateRefreshToken({id: user._id})

  const hashedRefreshToken = makeTokenHash(refreshToken);

  user.refreshToken = hashedRefreshToken;
  await user.save({validateBeforeSave: false});

  // step:7 - add refreshtoken in cookie and send accesstoken and userObj as response
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 //7days
  })

  // step:8 - genereateOtp and store in the redis and send to the frontend route
  const otp = generateOtp();
  const hashedOtp = makeTokenHash(otp);

  await redis.set(`login-otp:${user._id}`, hashedOtp, "EX", 120); //2min

  res.redirect(`${process.env.FRONTEND_BASE_URL}/auth/callback?otp=${encodeURIComponent(otp)}`);
})
// google OAuth login ends here***



export const exchangeOauthOtp = asyncHandler(async (req: Request, res: Response) => {
  // step:1 - extract the otp and refreshToken coming from frontend
  const {otp} = req.body;
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

  // step:4 - verify the otp; first convert the otp into hash and compare
  const hashedOtp = makeTokenHash(otp);
  const key = `login-otp:${user._id}`;
  const storedOtp = await redis.get(key);

  if(!storedOtp || hashedOtp !== storedOtp){
    await redis.del(key);
    throw ApiError.unAuthorized("invalid or expired otp, please login again");
  }

  // step:5 - now the otp is right then delete the otp in redis
  await redis.del(key);

  // step:6 - genereate and send accesstoken and user object
  const accessToken = generateAccessToken({id: user._id, role: user.role});

  const userObj = {
    name: user.name,
    email: user.email,
    role: user.role,
    userId: user._id
  }

  ApiResponse.ok(res, "user logged in successfully", {user: userObj, accessToken});
})



// github OAuth login***
export const githubLogin = asyncHandler(async (req: Request, res: Response) => {
  // step:1 - here we take the authorization endpoint of the github
  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");

  // step:2 - add params like clinet_id, redirect_uri, scope
  githubAuthUrl.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID!);
  githubAuthUrl.searchParams.set("redirect_uri", process.env.GITHUB_CALLBACK_URL!);
  githubAuthUrl.searchParams.set("scope", "read:user user:email");
  // read: user ---> user ki profile information access krni hai
  // user: email ---> kabhi kabhi email private hota h to uske access ke liye

  // step:3 - redirecting the authorization_endpoint of the github
  res.redirect(githubAuthUrl.toString());
})


export const githubCallback = asyncHandler(async (req: Request, res: Response) => {
  // step:1 - extract the short_code from the query that is coming from github
  const {code} = req.query;

  if (!code || typeof code !== "string") {
    throw ApiError.badRequest("Github authorization code is missing");
  }

  // step:2 - send the short_code, client_secret, client_id and redirect_uri to the github to get access and refreshtoken
  const bodyPayload = {
    code: code,
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    redirect_uri: process.env.GITHUB_CALLBACK_URL
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(bodyPayload),
    });
  
  if(!response.ok){
    throw ApiError.unAuthorized("Failed to exchange GitHub code");
  }

  const tokenData = await response.json() as IGithubTokenResponse;
  // console.log(tokenData);

  // step:3 - use access_token and call userinfo_endpoint to get the user details
  const githubAccessToken = tokenData.access_token
  const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json", //mujhe response github json format me chahiye
        Authorization: `Bearer ${githubAccessToken}`,
      },
    });

  // step:4 - if the user email is private then we have to call for the email
  const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${githubAccessToken}`,
        Accept: "application/vnd.github+json",
      },
    });
  
  const githubUser = await userResponse.json() as IGithubUser; //yahan mere pass user ki details hogi but agar user ne email ko private rakha hoga to email null hoga to email ke liye ek aur fetch call /user/emails pe call kar chuke h
  const githubEmails = await emailResponse.json() as IGithubEmail[]; //ye email ka array dega jisme user ke multiple emails ho sakte h usme se primary and verified wla nikalna h

  const primaryEmail = githubEmails.find((item: any) => item.primary && item.verified);
  if (!primaryEmail) {
    throw ApiError.unAuthorized("No verified primary email found");
  }

  // step:5 - find the user with the email that user exists or not in our DB
  let user = await userModel.findOne({ email: primaryEmail.email });
  if (!user) {
    user = await userModel.create({
      name: githubUser.name || githubUser.login,
      email: primaryEmail.email,
      authProvider: "github",
      providerId: githubUser.id.toString(),
    });
  }

  // step:6 - genereate refreshtoken for the user and hasedRefreshtoken store in the DB
  // if we send user and access_token as json then frontend doens't redirect to dashboard; frontend just shows the json data
  // so we only send the refreshtoken in cookie and a otp in query and frontend came with that otp and then wwe send the access_token because we can't send access_token (body data) with redirect
  const refreshToken = generateRefreshToken({id: user._id})

  const hashedRefreshToken = makeTokenHash(refreshToken);

  user.refreshToken = hashedRefreshToken;
  await user.save({validateBeforeSave: false});

  // step:7 - add refreshtoken in cookie and send accesstoken and userObj as response
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 //7days
  })

  // step:8 - genereateOtp and store in the redis and send to the frontend route
  const otp = generateOtp();
  const hashedOtp = makeTokenHash(otp);

  await redis.set(`login-otp:${user._id}`, hashedOtp, "EX", 120); //2min

  res.redirect(`${process.env.FRONTEND_BASE_URL}/auth/callback?otp=${encodeURIComponent(otp)}`);
})
// github OAuth login ends here***
