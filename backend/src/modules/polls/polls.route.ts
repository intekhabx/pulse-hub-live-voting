import express from "express";
import { isLoggedIn } from "../auth/auth.middleware";
import * as controller from './polls.controller';

const router = express.Router();

// routes
router.post('/create-poll', isLoggedIn, controller.createPolls);

router.get('/get-mypolls', isLoggedIn, controller.getMyPolls);

router.get('/get-poll/:pollId', controller.getPollById);



export default router;
