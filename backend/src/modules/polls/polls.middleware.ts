import type { NextFunction, Response } from "express";
import asyncHandler from "../../utils/async-handler.middleware";
import { verifyAccessToken, type AccessTokenPayload } from "../../utils/jwt-token.utils";
import userModel from "../auth/auth.model";
import type { AuthRequest } from "../../types/index.types";


export const checkAuthenticatedAndAnonymousUser = asyncHandler(async(req: AuthRequest, res: Response, next: NextFunction) => {
  // step:1 - check user is loggedin or not by verifying the header
  const authHeader = req?.headers?.authorization;

  // step:2 check the token starts from bearer in the header
  let token: string | undefined;
  if(authHeader && authHeader?.startsWith("Bearer ")){
    token = authHeader.split("Bearer ")[1];
  }

  // step:3 verify the accessToken is generated with our secret code or not
  let decoded;
  if(token){
    decoded = verifyAccessToken(token) as AccessTokenPayload;
  }

  // step:4 find the user in the DB with decoded data
  let user;
  if(decoded){
    user = await userModel.findById(decoded?.id);
  }

  // step:5 - if user exists then add userObj in the request
  if(user){
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role
    }
  }

  next();
})