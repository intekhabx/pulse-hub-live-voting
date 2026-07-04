import express from 'express';
import * as controller from './response.controller';
import { isLoggedIn } from '../auth/auth.middleware';

const router = express.Router();


// routes
router.post("/publish/:pollId", isLoggedIn, controller.publishPollResult);

router.get("/get-data", isLoggedIn, controller.getDashboardData);


export default router;