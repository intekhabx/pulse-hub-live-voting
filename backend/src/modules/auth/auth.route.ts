import express from 'express';
import * as controller from "./auth.controller";
import { isLoggedIn } from './auth.middleware';
import validate from '../../middleware/validate.middleware';
import { exchangeOauthOtpDto, loginDto, registerDto } from './auth.dto';

const router = express.Router();

router.post("/register", validate(registerDto), controller.register);
router.post("/login", validate(loginDto), controller.login);
router.post("/logout", isLoggedIn, controller.logout);
router.post("/refresh-token", controller.renewToken);

router.get("/user-session", controller.getUserSession);

router.get("/google-login", controller.googleLogin); //user clicks "continue with google" and to come this route
router.get("/google/callback", controller.googleCallback); //this route use only by google to redirection

router.post("/exchange-otp", validate(exchangeOauthOtpDto), controller.exchangeOauthOtp);

router.get("/github-login", controller.githubLogin); //user clicks "continue with github" and to come this route
router.get("/github/callback", controller.githubCallback); //this route use only by github to redirection


export default router;
