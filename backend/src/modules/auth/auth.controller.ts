import crypto from 'crypto';
import ApiError from "../../utils/api-error.utils";
import ApiResponse from "../../utils/api-response.utils";
import asyncHandler from '../../utils/async-handler.middleware';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, type RefreshTokenPayload } from "../../utils/jwt-token.utils";
import userModel, { type IUser } from "./auth.model";

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

function genereateRandomToken(){
  return crypto.randomUUID();
}


async function signInUser(res: Response, user: IUser){
  // step:1 - genereate refreshtoken for the user and hasedRefreshtoken store in the DB
  // if we send user and access_token as json then frontend doens't redirect to dashboard; frontend just shows the json data
  // so we only send the refreshtoken in cookie and a otp in query and frontend came with that otp and then wwe send the access_token because we can't send access_token (body data) with redirect
  const refreshToken = generateRefreshToken({id: user._id})

  const hashedRefreshToken = makeTokenHash(refreshToken);

  user.refreshToken = hashedRefreshToken;
  await user.save({validateBeforeSave: false});

  // step:2 - add refreshtoken in cookie and send accesstoken and userObj as response
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 //7days
  })

  // step:3 - genereateOtp and store in the redis and send to the frontend route
  const otp = generateOtp();
  const hashedOtp = makeTokenHash(otp);

  await redis.set(`login-otp:${user._id}`, hashedOtp, "EX", 120); //2min

  // agar hmlg normal response return krenge to browser me json show hoga; to 2 option h; ya to html send kro ya redirect kro ek route pe
  res.redirect(`${process.env.FRONTEND_BASE_URL}/auth/callback?otp=${encodeURIComponent(otp)}`);
}


async function sendTokenForLinking(res: Response, userId: string, providerId: string, provider: "google" | "github", email: string){
  // step:1 - genereate a random token and make them hash
  const linkToken = genereateRandomToken();
  const hashedLinkToken = makeTokenHash(linkToken);

  // step:2 - store userId, providerId and provider in the the redis
  const key = `token-link:${hashedLinkToken}`;
  const data = JSON.stringify({userId, providerId, provider});
  await redis.set(key, data, "EX", 300); //5min

  // step:3 - send the linkToken to the frontend and user email too, to show on page
  res.redirect(`${process.env.FRONTEND_BASE_URL}/auth/confirm?link_token=${encodeURIComponent(linkToken)}&email=${encodeURIComponent(email)}`)
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

  const user = await userModel.findOne({email}).select('+password +googleId +githubId');
  if(!user) throw ApiError.unAuthorized("invalid user credientials");

  if (!user.password && user.googleId) {
    throw ApiError.unAuthorized("This account uses Google sign-in. Please continue with Google.");
  }
  if(!user.password && user.githubId){
    throw ApiError.unAuthorized("This account uses Github sign-in. Please continue with Github.");
  }

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
    userId: user._id,
    isPasswordExists: password ? true : false,
    isGoogleLinked: user.googleId ? true : false,
    isGithubLinked: user.githubId ? true : false,
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



export const updateUserDetails = asyncHandler(async (req: AuthRequest, res: Response)=> {
  // step:1 - extract the name and email that user want to update
  const {name, email} = req.body;
  const userId = req.user?.id;

  // step:2 - if email is present then check other user have already registered with same email or not
  if (email) {
    const existingUser = await userModel.findOne({email, _id: { $ne: userId }}); //$ne - not equal

    if (existingUser){
      throw ApiError.conflict("Email already in use");
    }
  }

  // step:3 - find the user useing req.user.id and update with new details
  const user = await userModel.findByIdAndUpdate(userId, {
      name,
      email,
    },{returnDocument: "after", runValidators: true,}).select("+password +googleId +githubId");

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  // step:4 - send only non-sensitive data to the frontend
  const userObj = {
    name: user.name,
    email: user.email,
    role: user.role,
    userId: user._id,
    isPasswordExists: user.password ? true : false,
    isGoogleLinked: user.googleId ? true : false,
    isGithubLinked: user.githubId ? true : false,
  }

  ApiResponse.ok(res, "user details updated successfully", {user: userObj});
})



export const updateUserPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  // step:1 - extract the newPassword and currentPassword from body
  const {newPassword, currentPassword} = req.body;

  // step:2 - find the user using the req.user.id
  const user = await userModel.findById(req.user?.id).select("+password +googleId +githubId");
  if(!user || (!user.password && !user.googleId && !user.githubId)){
    throw ApiError.unAuthorized("user doesn't exists");
  }

  // step:3 - currentPassword should be required when password is already present in the DB
  if (user.password) {
    if (!currentPassword) {
      throw ApiError.badRequest("please provide current password");
    }
  
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      throw ApiError.unAuthorized("invalid or incorrect password");
    }
  }

  // step:4 - now the current password is same so we update the currectPassword to newPassword || this user sets their password first time
  user.password = newPassword;
  await user.save();

  ApiResponse.ok(res, "password updated successfully");
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



export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  // step:1 - generate the state and store in the redis for csrf protection
  const state = genereateRandomToken();
  await redis.set(`oauth-login-state:${state}`, "1", "EX", 300); // 5 min

  // step:2 - this function creates a authorization_url with client_id, scope, redirect_uri etc...
  const googleAuthUrl = googleOAuth2Client.generateAuthUrl({
    access_type: "offline", // user jab offline ho jaye to v uske behalf pe refresh_token ka use kar sake google API ke saath
    scope: ["openid", "email", "profile"],
    prompt: "select_account", //User ko account selection screen dikhao email ka choose krne ke liye agar ek se jyda email h to
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    state
  });

  // step:3 - redirect to the authorization_endpoint through our backend
  // console.log(googleAuthUrl);
  res.redirect(googleAuthUrl);
})



export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  // step:1 - extract the short_code and state from the query that is coming from google
  const { code, state } = req.query;

  if (!code || typeof code !== "string") throw ApiError.badRequest("Google authorization code is missing");
  if (!state || typeof state !== "string") throw ApiError.badRequest("Google authorization state is missing");

  // step:2 - check the state is right or not by finding the state in redis
  const key = `oauth-login-state:${state}`;
  const isValidState = await redis.get(key);
  if (!isValidState) {
    await redis.del(key);
    throw ApiError.badRequest("invalid or expired login session");
  }

  await redis.del(key); //delete the used state

  // step:3 - send the short_code, client_secret, and redirect_uri to the google and get tokens (client_secret, client_id saath me send ho rha h jo hmne googleOAuth2Client config krte hue diya tha)
  const { tokens } = await googleOAuth2Client.getToken({code: code, redirect_uri: process.env.GOOGLE_CALLBACK_URL});
  // console.log(tokens);

  // step:4 - Set the received tokens on the OAuth client.
  // This is NOT required for Google login.
  // It is only needed if we want to use the OAuth client later
  // to make authenticated requests to other Google services/APIs. like calender , gmail etc.
  googleOAuth2Client.setCredentials(tokens);

  // step:5 - get the authenticated user profile details
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

  // step:6 - find the user with the email that user exists or not
  const user = await userModel.findOne({ email: data.email }).select("+googleId");
  if (!user) {
    const newUser = await userModel.create({
      name: data.name,
      email: data.email,
      googleId: data.id,
    });
    // user new h to uska account create krne ke baad login access de do
    return await signInUser(res, newUser);
  }

  // step:7 - now if user exists with email then check its googleId; if googleId is same then usko v login krne do
  if (user.googleId === data.id) {
    return await signInUser(res, user);
  }

  // step:8 - if the email found and doesn't have googleId then send request for linking
  if(!user.googleId){
    return await sendTokenForLinking(res, user._id.toString(), data.id, "google", user.email);
  }

  // step:9 - now if the googleId doesn't match then reject the login
  throw ApiError.conflict("This account is linked to another Google account.");
})



export const exchangeOauthOtp = asyncHandler(async (req: Request, res: Response) => {
  // step:1 - extract the otp and refreshToken coming from frontend
  const {otp} = req.body;
  const refreshToken = req.cookies?.refreshToken;
  if(!(refreshToken && refreshToken.trim())) throw ApiError.unAuthorized("invalid or missing refresh token");

  // step:2 - verifyRefreshToken, to ensure, it is genereated through our secret
  const decoded = verifyRefreshToken(refreshToken) as RefreshTokenPayload;
  // we find user with decoded value, if user found then it is right
  const user = await userModel.findById(decoded.id).select("+refreshToken +password +googleId +githubId");
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
    userId: user._id,
    isPasswordExists: user.password ? true : false,
    isGoogleLinked: user.googleId ? true : false,
    isGithubLinked: user.githubId ? true : false,
  }

  ApiResponse.ok(res, "user logged in successfully", {user: userObj, accessToken});
})



export const linkOauthAccount = asyncHandler(async (req: Request, res: Response) => {
  // step:1 - extract the link_token and the password from body
  const {link_token, password} = req.body;

  // step:2 - create the link_token hashed to find the data in the redis
  const hashed_link_token = makeTokenHash(link_token);
  const key = `token-link:${hashed_link_token}`;
  const rawData = await redis.get(key);
  if(!rawData){
    throw ApiError.badRequest("invalid or expired token link");
  }

  const {userId, providerId, provider} = JSON.parse(rawData);
  
  // step:3 - find user and check the password is correct or not
  const user = await userModel.findById(userId).select('+password +googleId +githubId');
  if(!user) throw ApiError.unAuthorized("invalid user credientials");

  const verify = await user.comparePassword(password);
  if(!verify) throw ApiError.unAuthorized("invalid user credientials");

  // step:4 - now the password is correct so link the user with oauth service ("google" | "github")
  if(provider === "google"){
    if(user.googleId){ //googleId pehle hi exist krta h to error do
      throw ApiError.badRequest("Google account is already linked");
    }

    user.googleId = providerId;
  }
  else if(provider === "github"){
    if(user.githubId){ //googleId pehle hi exist krta h to error do
      throw ApiError.badRequest("Github account is already linked");
    }

    user.githubId = providerId;
  }
  else{
    throw ApiError.badRequest("unsupported oauth provider");
  }

  await user.save();

  // step:5 - delete the token record from redis
  await redis.del(key);

  // step:6 - genereate access and refreshtoken for the user and store in the db
  const accessToken = generateAccessToken({id: user._id, role: user.role});
  const refreshToken = generateRefreshToken({id: user._id})

  const hashedRefreshToken = makeTokenHash(refreshToken);

  // select: false se woh data query me nhi aata h but update kr sakte h data ko
  user.refreshToken = hashedRefreshToken;
  await user.save({validateBeforeSave: false});

  // step:7 - add refershtoken in the cookie and send user and accesstoken as response
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
    userId: user._id,
    isPasswordExists: user.password ? true : false,
    isGoogleLinked: (user.googleId || provider === "google") ? true : false,
    isGithubLinked: (user.githubId || provider === "github") ? true : false,
  }

  ApiResponse.ok(res, "user logged in successfully", {user: userObj, accessToken})
})



export const githubLogin = asyncHandler(async (req: Request, res: Response) => {
  // step:1 - generate the state and store in the redis for csrf protection
  const state = genereateRandomToken();
  await redis.set(`oauth-login-state:${state}`, "1", "EX", 300); // 5 min

  // step:2 - here we take the authorization endpoint of the github
  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");

  // step:3 - add params like clinet_id, redirect_uri, scope
  githubAuthUrl.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID!);
  githubAuthUrl.searchParams.set("redirect_uri", process.env.GITHUB_CALLBACK_URL!);
  githubAuthUrl.searchParams.set("scope", "read:user user:email");
  githubAuthUrl.searchParams.set("state", state);
  // read: user ---> user ki profile information access krni hai
  // user: email ---> kabhi kabhi email private hota h to uske access ke liye

  // step:4 - redirecting the authorization_endpoint of the github
  res.redirect(githubAuthUrl.toString());
})



export const githubCallback = asyncHandler(async (req: Request, res: Response) => {
  // step:1 - extract the short_code and state from the query that is coming from github
  const { code, state } = req.query;

  if (!code || typeof code !== "string") throw ApiError.badRequest("Github authorization code is missing");
  if (!state || typeof state !== "string") throw ApiError.badRequest("Github authorization state is missing");

  // step:2 - check the state is right or not by finding the state in redis
  const key = `oauth-login-state:${state}`;
  const isValidState = await redis.get(key);
  if (!isValidState) {
    await redis.del(key);
    throw ApiError.badRequest("invalid or expired login session");
  }

  await redis.del(key); //delete the used state

  // step:3 - send the short_code, client_secret, client_id and redirect_uri to the github to get access and refreshtoken
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

  // step:4 - use access_token and call userinfo_endpoint to get the user details
  const githubAccessToken = tokenData.access_token
  const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json", //mujhe response github json format me chahiye
        Authorization: `Bearer ${githubAccessToken}`,
      },
    });

  // step:5 - if the user email is private then we have to call for the email
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

  // step:6 - find the user with the email that user exists or not in our DB
  const user = await userModel.findOne({ email: primaryEmail.email });
  if (!user) {
    const newUser = await userModel.create({
      name: githubUser.name || githubUser.login,
      email: primaryEmail.email,
      githubId: githubUser.id.toString(),
    });
    // user new h to uska account create krne ke baad login access de do
    return await signInUser(res, newUser);
  }

  // step:7 - now if user exists with email then check its githubId; if githubId is same then usko v login krne do
  if (user.githubId === githubUser.id.toString()) {
    return await signInUser(res, user);
  }

  // step:8 - if the email found and doesn't have githubId then send request for linking
  if(!user.githubId){
    return await sendTokenForLinking(res, user._id.toString(), githubUser.id.toString(), "github", user.email);
  }

  // step:9 - now if the googleId doesn't match then reject the login
  throw ApiError.conflict("This account is linked to another Github account.");
})



export const googleConnect = asyncHandler(async (req: AuthRequest, res: Response) => {
  // step:1 - generate the state and store in the redis for csrf protection
  const state = genereateRandomToken();
  await redis.set(`oauth-connect-state:${state}`, req.user?.id.toString()!, "EX", 300); // 5 min

  // step:2 - build the authorization_endpoint url
  const url = googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    prompt: "select_account",
    state,
    redirect_uri: process.env.GOOGLE_CONNECT_CALLBACK_URL,
  });

  // step:3 - Return the generated Google OAuth authorization URL to the frontend.
  // This endpoint is authenticated, so the frontend calls it using Axios with
  // the user's access token. The frontend then navigates the browser to this URL
  // to start the Google OAuth flow.
  ApiResponse.ok(res, "google authorization_url generated successfully", {url});
});



export const googleConnectCallback = asyncHandler(async (req: Request, res: Response) => {
  // step:1 - extract the short_code and state that is comming from google
  const { code, state } = req.query;
  if (!code || typeof code !== "string") throw ApiError.badRequest("code missing");
  if (!state || typeof state !== "string") throw ApiError.badRequest("state missing");

  // step:2 - check the state is right or not by finding the state in redis
  const key = `oauth-connect-state:${state}`;
  const userId = await redis.get(key);
  if (!userId) {
    await redis.del(key);
    throw ApiError.badRequest("invalid or expired connect session");
  }

  await redis.del(key); //delete the used state

  // step:3 - send the short_code, redirect_uri (client_id AND secret- is in config) to the google and get tokens
  const { tokens } = await googleOAuth2Client.getToken({code: code, redirect_uri: process.env.GOOGLE_CONNECT_CALLBACK_URL});
  googleOAuth2Client.setCredentials(tokens);

  // step:4 - get the user profile details
  const oauth2 = google.oauth2({
    auth: googleOAuth2Client,
    version: "v2",
    // we have already set the credentials in googleOAuth2Client so we don't need to send access_token explicitly
  });

  const { data } = await oauth2.userinfo.get();
  if (!data || !data?.id){
    throw ApiError.unAuthorized("could not fetch google profile");
  }

  // step:5 - checking ye googleId kisi aur account se pehle se linked to nahi?
  const existing = await userModel.findOne({ googleId: data.id });
  if (existing && existing._id.toString() !== userId) {
    return res.redirect(`${process.env.FRONTEND_BASE_URL}/dashboard?section=settings&connect_error=already_linked`);
  }

  // step:6 - new the googleId is not registered with anyone then connect to the user
  const user = await userModel.findById(userId);
  if (!user) throw ApiError.unAuthorized("user not found");

  // if user has already connected their google account
  if (user.googleId) {
    return res.redirect(`${process.env.FRONTEND_BASE_URL}/dashboard?section=settings&connect_error=google_already_connected`);
  }
  
  user.googleId = data.id;
  await user.save();

  res.redirect(`${process.env.FRONTEND_BASE_URL}/dashboard?section=settings&connected=google`);
});



export const githubConnect = asyncHandler(async (req: AuthRequest, res: Response) => {
  // step:1 - generate a random state and store in the redis
  const state = genereateRandomToken();
  await redis.set(`oauth-connect-state:${state}`, req.user?.id.toString()!, "EX", 300); //5min

  // step:2 - here we take the authorization endpoint of the github
  const url = new URL("https://github.com/login/oauth/authorize");

  // step:3 - add params like clinet_id, redirect_uri, scope
  url.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID!);
  url.searchParams.set("redirect_uri", process.env.GITHUB_CONNECT_CALLBACK_URL!);
  url.searchParams.set("scope", "read:user user:email");
  url.searchParams.set("state", state);
  // read: user ---> user ki profile information access krni hai
  // user: email ---> kabhi kabhi email private hota h to uske access ke liye

  // step:3 - Return the generated Github OAuth authorization URL to the frontend.
  // This endpoint is authenticated, so the frontend calls it using Axios with
  // the user's access token. The frontend then navigates the browser to this URL
  // to start the Github OAuth flow.
  ApiResponse.ok(res, "github authorization_url generated successfully", {url: url.toString()});
})



export const githubConnectCallback = asyncHandler(async (req: Request, res: Response) => {
  // step:1 - extract the short_code and the state from the query that is coming from github
  const {code, state} = req.query;

  if (!code || typeof code !== "string") throw ApiError.badRequest("code missing");
  if (!state || typeof state !== "string") throw ApiError.badRequest("state missing");

  // step:2 - check the state is same or not that is stored in the redis
  const key = `oauth-connect-state:${state}`;
  const userId = await redis.get(key);
  if (!userId) {
    await redis.del(key);
    throw ApiError.badRequest("invalid or expired connect session");
  }

  await redis.del(key); //delete the used state

  // step:3 - send the short_code, client_secret, client_id and redirect_uri to the github to get access and refreshtoken
  const bodyPayload = {
    code: code,
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    redirect_uri: process.env.GITHUB_CONNECT_CALLBACK_URL,
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

  const tokens = await response.json() as IGithubTokenResponse;
  // console.log(tokens);
  if(!tokens.access_token){
    throw ApiError.unAuthorized("GitHub access token missing");
  }

  // step:4 - use access_token and call userinfo_endpoint to get the user details
  const githubAccessToken = tokens.access_token
  const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json", //mujhe response github json format me chahiye
        Authorization: `Bearer ${githubAccessToken}`,
      },
    });

  if (!userResponse.ok) {
    throw ApiError.unAuthorized("Failed to fetch GitHub user");
  }
  
  const githubUser = await userResponse.json() as IGithubUser; //yahan mere pass user ki details hogi but agar user ne email ko private rakha hoga to email null hoga to email ke liye ek aur fetch call /user/emails pe call kar chuke h

  // step:5 - checking ye githubId kisi aur account se pehle se linked to nahi?
  const existing = await userModel.findOne({ githubId: githubUser.id.toString() });
  if (existing && existing._id.toString() !== userId) {
    return res.redirect(`${process.env.FRONTEND_BASE_URL}/dashboard?section=settings&connect_error=already_linked`);
  }

  // step:6 - now the githubId is not registered with anyone then connect to the user
  const user = await userModel.findById(userId);
  if (!user) throw ApiError.unAuthorized("user not found");

  // if user has already connected their github account
  if (user.githubId) {
    return res.redirect(`${process.env.FRONTEND_BASE_URL}/dashboard?section=settings&connect_error=github_already_connected`);
  }
  
  user.githubId = githubUser.id.toString();
  await user.save();

  res.redirect(`${process.env.FRONTEND_BASE_URL}/dashboard?section=settings&connected=github`);
})



export const googleDisconnect = asyncHandler(async(req: AuthRequest, res: Response)=> {
  // step:1 - find the user using the req.user.id
  const user = await userModel.findById(req.user?.id).select("+googleId +githubId +password");
  if(!user){
    throw ApiError.unAuthorized("user not found");
  }

  // step:2 - user wants to disconnect google so (check user is first connected or not)
  if(!user.googleId){
    throw ApiError.conflict("Google account is not connected");
  }

  // step:3 - check the user has another method present or not for login
  if(!user.password && !user.githubId){
    throw ApiError.badRequest("You can't disconnect your Google account because no other login method is available");
  }

  // step:4 - now user have another method to login in their account so disconenct google
  const result = await user.updateOne({ $unset: { googleId: 1 } });
  if (result.modifiedCount === 0) {
    throw ApiError.conflict("Failed to disconnect Google account");
  }

  ApiResponse.ok(res, "Google Account Disconnected successfully", {isGoogleLinked: false});
})



export const githubDisconnect = asyncHandler(async(req: AuthRequest, res: Response) => {
  // step:1 - find the user using the req.user.id
  const user = await userModel.findById(req.user?.id).select("+googleId +githubId +password");
  if(!user){
    throw ApiError.unAuthorized("user not found");
  }

  // step:2 - user wants to disconnect github so (check user is first connected or not)
  if(!user.githubId){
    throw ApiError.conflict("Github account is not connected");
  }

  // step:3 - check the user has another method present or not for login
  if(!user.password && !user.googleId){
    throw ApiError.badRequest("You can't disconnect your Github account because no other login method is available");
  }

  // step:4 - now user have another method to login in their account so disconenct github
  const result = await user.updateOne({ $unset: { githubId: 1 } });
  if (result.modifiedCount === 0) {
    throw ApiError.conflict("Failed to disconnect Github account");
  }

  ApiResponse.ok(res, "Github Account Disconnected successfully", {isGithubLinked: false});
})
