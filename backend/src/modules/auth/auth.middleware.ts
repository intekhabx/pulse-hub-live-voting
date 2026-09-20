import type { Response, NextFunction } from "express";
import ApiError from "../../utils/api-error.utils";
import { verifyAccessToken, type AccessTokenPayload } from "../../utils/jwt-token.utils";
import userModel from "./auth.model";
import type { AuthRequest } from "../../types/index.types";
import asyncHandler from "../../utils/async-handler.middleware";
import subscriptionModel from "../subscription/subscription.model";


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

      // step:2 - Fetch the latest ACTIVE or CANCELLED subscription from DB
      const subscription = await subscriptionModel.findOne({
        userId: req.user.id,
        status: {$in: ["ACTIVE", "CANCELLED"]},
        currentPeriodStart: {$exists: true},
      })
      .sort({currentPeriodStart: -1});


      // step:3 - expiry check (BullMQ Failure Safety Net)
      if(subscription){
        const currentDate = new Date();

        if(subscription.status && currentDate > subscription.currentPeriodEnd){
          //1. update the subscription status in DB
          subscription.status = subscription.status === "CANCELLED" ? "EXPIRED" : "COMPLETED";
          await subscription.save();
  
          //2. reset user plan in DB
          await userModel.findByIdAndUpdate(req.user.id, {
            plan: "FREE",
          })
  
          // 3. update req.user object in memory for current request cycle
          req.user.plan = "FREE";
  
          throw ApiError.forbidden("Your subscription period has ended");
        }

      }
      else {
        // Agar DB me koi ACTIVE/CANCELLED subscription bachi hi nahi hai,
        // Lekin User DB document me plan abhi bhi PRO/PREMIUM hai:
        if (req.user.plan !== "FREE") {
          await userModel.findByIdAndUpdate(req.user.id, { plan: "FREE" });
          req.user.plan = "FREE";
        }
      }

      // step:4 - validate if user's (updated) plan is allowed
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
