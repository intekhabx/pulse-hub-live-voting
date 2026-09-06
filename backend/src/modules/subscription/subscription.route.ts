import express from 'express';
import { isLoggedIn, requirePlan } from '../auth/auth.middleware';
import * as controller from "./subscription.controller";

const router = express.Router();


router.get("/user-plan-details", isLoggedIn, controller.getUserPlanDetails);

router.get("/can-user-use", isLoggedIn, requirePlan("PRO", "PREMIUM"), controller.canFreeUserUseService);
router.get("/export-everypoll-csv", isLoggedIn, requirePlan("PRO", "PREMIUM"), controller.exportAllPollCSV);


export default router;
