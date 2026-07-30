import express from "express";
import { isLoggedIn } from "../auth/auth.middleware";
import * as controller from './polls.controller';
import { checkAuthenticatedAndAnonymousUser } from "./polls.middleware";

const router = express.Router();

// routes
router.post('/create-poll', isLoggedIn, controller.createPolls);

router.get('/get-mypolls', isLoggedIn, controller.getMyPolls);

router.get('/get-poll/:pollId', controller.getPollById);

router.post("/submit-vote/:pollId", checkAuthenticatedAndAnonymousUser, controller.submitVote);

router.get('/get-poll-analytics/:pollId', isLoggedIn, controller.getPollAnalytics);

router.get("/get-analytics-page-data", isLoggedIn, controller.getAnalyticsPageData);


export default router;
  