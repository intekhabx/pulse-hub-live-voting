import express from 'express';
import { isLoggedIn, requirePlan } from '../auth/auth.middleware';
import * as controller from "./subscription.controller";
import { razorpayWebhook } from './subscription.webhook';

const router = express.Router();


router.get("/user-plan-details", isLoggedIn, controller.getUserPlanDetails);

router.get("/can-user-use", isLoggedIn, requirePlan("PRO", "PREMIUM"), controller.canFreeUserUseService);
router.get("/export-everypoll-csv", isLoggedIn, requirePlan("PRO", "PREMIUM"), controller.exportAllPollCSV);

router.post("/create", isLoggedIn, controller.createSubscription);
router.delete("/cancel", isLoggedIn, requirePlan("PRO", "PREMIUM"), controller.cancelSubscription);
// this is the route where razorpay calls and raw req should be enter
router.post("/webhook/razorpay", express.raw({type: "application/json"}), razorpayWebhook);


export default router;
