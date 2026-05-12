import express from 'express';
import * as controller from "./auth.controller";
import { isLoggedIn } from './auth.middleware';
import validate from '../../middleware/validate.middleware';
import { loginDto, registerDto } from './auth.dto';

const router = express.Router();

router.post("/register", validate(registerDto), controller.register);
router.post("/login", validate(loginDto), controller.login);
router.post("/logout", isLoggedIn, controller.logout);
router.post("/refresh-token", controller.renewToken)


export default router;
