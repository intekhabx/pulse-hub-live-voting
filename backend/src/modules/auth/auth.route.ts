import express from 'express';
import * as controller from "./auth.controller";
import { isLoggedIn } from './auth.middleware';
import validate from '../../middleware/validate.middleware';
import { loginDto, registerDto, resendOtpDto, verifyOtpDto } from './auth.dto';

const router = express.Router();

router.post("/register", validate(registerDto), controller.register);
router.post("/verify-otp", validate(verifyOtpDto), controller.verifyOtp);
router.post("/resend-otp", validate(resendOtpDto), controller.resendOtp);
router.post("/login", validate(loginDto), controller.login);
router.post("/logout", isLoggedIn, controller.logout);
router.post("/refresh-token", controller.renewToken);

router.get("/user-session", controller.getUserSession);


export default router;
