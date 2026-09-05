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
    plan: user.plan,
    role: user.role
  }
  next();
})





type PlanType = "FREE" | "PRO" | "PREMIUM";

// authorization based on the plan
export const requirePlan = (...allowedPlans: PlanType[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // step:1 - check user is present or not in the req object
      if (!req.user) {
        throw ApiError.unAuthorized("Authentication required");
      }

      // step:2 - check user plan has authorized plan or not ("PRO, PREMIUM")
      if (!allowedPlans.includes(req.user.plan)) {
        throw ApiError.forbidden("Your current plan does not support this feature");
      }

      next();
    } 
    catch (error) {
      next(error);
    }
  };
};
