import express from 'express';
import * as controller from "./auth.controller";
import { isLoggedIn } from './auth.middleware';
import validate from '../../middleware/validate.middleware';
import { exchangeOauthOtpDto, linkOauthAccountDto, loginDto, registerDto, updateUserDetailsDto, updateUserPasswordDto } from './auth.dto';

const router = express.Router();

router.post("/register", validate(registerDto), controller.register);
router.post("/login", validate(loginDto), controller.login);
router.post("/logout", isLoggedIn, controller.logout);
router.post("/refresh-token", controller.renewToken);
router.patch("/update-user", validate(updateUserDetailsDto), isLoggedIn, controller.updateUserDetails);
router.patch("/update-password", validate(updateUserPasswordDto), isLoggedIn, controller.updateUserPassword);

router.get("/user-session", controller.getUserSession);

router.get("/google-login", controller.googleLogin); //user clicks "continue with google" and to come this route
router.get("/google/callback", controller.googleCallback); //this route use only by google to redirection

router.post("/exchange-otp", validate(exchangeOauthOtpDto), controller.exchangeOauthOtp);
router.post("/link-oauth-account", validate(linkOauthAccountDto), controller.linkOauthAccount);

router.get("/github-login", controller.githubLogin); //user clicks "continue with github" and to come this route
router.get("/github/callback", controller.githubCallback); //this route use only by github to redirection

// user-oauth-account-connect
router.get("/google-connect", isLoggedIn, controller.googleConnect);
router.get("/google-connect/callback", controller.googleConnectCallback);

router.get("/github-connect", isLoggedIn, controller.githubConnect);
router.get("/github-connect/callback", controller.githubConnectCallback);

router.delete("/google-disconnect", isLoggedIn, controller.googleDisconnect);
router.delete("/github-disconnect", isLoggedIn, controller.githubDisconnect);



export default router;
