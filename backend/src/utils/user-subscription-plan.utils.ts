import { SUBSCRIPTION_PLAN_DETAILS } from "../constants/subscription-plan-details";



export const getSubscriptionPlanDetails = (plan: "FREE" | "PRO" | "PREMIUM") => {
  return SUBSCRIPTION_PLAN_DETAILS[plan]
}


// this utils function give me that features in present on this plan or not
export const hasFeatureOnSubscriptionPlan = (plan: "FREE" | "PRO" | "PREMIUM", feature: keyof typeof SUBSCRIPTION_PLAN_DETAILS.FREE) => {
  return SUBSCRIPTION_PLAN_DETAILS[plan][feature];
}
