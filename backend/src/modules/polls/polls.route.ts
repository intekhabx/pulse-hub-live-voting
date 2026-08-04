import express from "express";
import { isLoggedIn } from "../auth/auth.middleware";
import * as controller from './polls.controller';
import { checkAuthenticatedAndAnonymousUser } from "./polls.middleware";
import validate from "../../middleware/validate.middleware";
import { createPollDto, updatePollDto } from "./polls.dto";

const router = express.Router();

// routes
router.post('/create-poll', isLoggedIn, validate(createPollDto), controller.createPolls);

router.patch('/update-poll/:pollId', isLoggedIn, validate(updatePollDto), controller.editAndUpdatePoll);

router.get('/get-mypolls', isLoggedIn, controller.getMyPolls);

router.get('/get-poll/:pollId', controller.getPollById);

router.post("/submit-vote/:pollId", checkAuthenticatedAndAnonymousUser, controller.submitVote);

router.get('/get-poll-analytics/:pollId', isLoggedIn, controller.getPollAnalytics);

router.get("/get-analytics-page-data", isLoggedIn, controller.getAnalyticsPageData);

router.delete("/delete-poll/:pollId", isLoggedIn, controller.deletePollById);

router.get("/get-recent-activity", isLoggedIn, controller.getRecentActivity);


export default router;
  