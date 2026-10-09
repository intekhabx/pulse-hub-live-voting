import express from "express";
import * as controller from "./contact.controller";
import { createMessageDto } from "./contact.dto";
import validate from "../../middleware/validate.middleware";


const router = express.Router();


router.post("/message", validate(createMessageDto), controller.createMessage);



export default router;
