import express from 'express';
import { isLoggedIn } from '../auth/auth.middleware';
import * as controller from "./subscription.controller";

const router = express.Router();


router.get("/user-plan-details", isLoggedIn, controller.getUserPlanDetails);


export default router;
