import express from "express";
import { isLoggedIn } from "../auth/auth.middleware";
import * as controller from './polls.controller';
import { checkAuthenticatedAndAnonymousUser } from "./polls.middleware";
import validate from "../../middleware/validate.middleware";
import { createPollDto, updatePollDto } from "./polls.dto";

const router = express.Router();

// routes
router.post('/create-poll', isLoggedIn, validate(createPollDto), controller.createPolls);

router.post('/create-poll-draft', isLoggedIn, validate(createPollDto), controller.createPollAsDraft);

router.patch('/update-poll-as-active/:pollId', isLoggedIn, controller.updatePollAsActive);

router.patch('/update-poll/:pollId', isLoggedIn, validate(updatePollDto), controller.editAndUpdatePoll);

router.get('/get-mypolls', isLoggedIn, controller.getMyPolls);

router.get('/get-poll/:pollId', controller.getPollById);

router.get('/get-mypoll/:pollId', isLoggedIn, controller.getMyPollById);

router.post("/submit-vote/:pollId", checkAuthenticatedAndAnonymousUser, controller.submitVote);

router.get('/get-poll-analytics/:pollId', isLoggedIn, controller.getPollAnalytics);

router.get("/get-analytics-page-data", isLoggedIn, controller.getAnalyticsPageData);

router.delete("/delete-poll/:pollId", isLoggedIn, controller.deletePollById);

router.get("/get-recent-activity", isLoggedIn, controller.getRecentActivity);

router.post("/publish-poll/:pollId", isLoggedIn, controller.publishPollResult);

router.get("/get-published-poll-analytics/:pollId", controller.getPublishedPollQuestionsAnalytics)


export default router;
  