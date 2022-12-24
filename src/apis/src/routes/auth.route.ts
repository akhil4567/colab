import express from "express";
import passport from "passport";
import AuthController from "../controllers/auth.controller";
import { validate } from "express-validation";
import {
  authValidation,
  resetPasswordValidationMail,
  resetPasswordValidation,
  addPasswordValidation,
  parseError,
} from "../validators";
import { log } from "../common/classes/log.class";

import { string } from "joi";
import { config } from "../common/config/config";
import authMiddleware from "../common/middlewares/authentication";
import inviteAuthMiddleware from "../common/middlewares/inviteAuthentication";
import {
  changePasswordValidation,
  confirmMailValidation,
} from "../validators/auth";
const router = express.Router();

router.post(
  "/api/v1/account/login",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    passport.authenticate(
      "local",
      { session: false },
      async (err: any, user, info) => {
        if (err || !user) {
          return res.status(400).json({
            statusCode: 400,
            error: info ? info.message : "Login Failed",
          });
        }

        const result = await AuthController.login(req, res, user);
      }
    )(req, res);
  }
);

router.post(
  "/api/v1/account/signup",
  validate(authValidation, {}, {}),
  parseError,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await AuthController.signup(req, res);
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/api/v1/account/add-password",
  validate(addPasswordValidation, {}, {}),
  parseError,
  inviteAuthMiddleware,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await AuthController.addPassword(req, res);
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/api/v1/account/reset-password-mail",
  validate(resetPasswordValidationMail, {}, {}),
  parseError,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await AuthController.resetPasswordMail(req, res);
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/api/v1/account/confirm-mail-send",
  authMiddleware,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await AuthController.sendConfirmMail(req, res);
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);
router.post(
  "/api/v1/account/confirm-email",
  validate(confirmMailValidation, {}, {}),
  parseError,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await AuthController.confirmMail(req, res);
      return res.status(200).json({
        statusCode: 200,
        message: "Email Verified Successfully",
      });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/api/v1/account/change-password",
  validate(changePasswordValidation, {}, {}),
  parseError,
  authMiddleware,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await AuthController.changePassword(req, res);
      return res.status(200).json({
        statusCode: 200,
        data: result,
        message: "Change Password Successfully",
      });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/api/v1/account/reset-password",
  validate(resetPasswordValidation, {}, {}),
  parseError,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await AuthController.resetPassword(req, res);

      return res.status(200).json({
        statusCode: 200,
        message: "Password Reset success",
        data: result,
      });
    } catch (error: any) {
      log.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/api/v1/account/google/start",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    passport.authenticate("loginGoogle", <any>{
      session: false,
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/calendar.events",
      ],
      accessType: "offline",
      prompt: "select_account",
    })(req, res, next);
  }
);

router.get(
  "/api/v1/account/google/redirect",

  passport.authenticate("loginGoogle", {
    session: false,
    failureRedirect: `${config.clientUrl}/auth/home`,
    failureMessage: true,
  }),

  function (req: any, res) {
    const token = req?.user?.token;
    // Successful authentication, redirect home.
    //loading page.

    res.redirect(`${config.clientUrl}/?token=${token}`);
  }
),
  router.get(
    "/api/v1/account/outlook/start",
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      passport.authenticate("loginOutlook", {
        session: false,
        scope: [
          "openid",
          "profile",
          "offline_access",
          "https://outlook.office.com/Calendars.ReadWrite",
        ],
      })(req, res, next);
    }
  );

router.get(
  "/api/v1/account/outlook/callback",

  passport.authenticate("loginOutlook", {
    session: false,
    failureRedirect: `${config.clientUrl}/auth/home`,
  }),
  function (req: any, res) {
    const token = req?.user?.token;
    // Successful authentication, redirect home.
    res.redirect(`${config.clientUrl}/?token=${token}`);
  }
);

/**------------------------------------------------ */

/**
 *  Email oAuth routes Gmail and Outlook
 */

/**------------------------------------------------ */

router.get(
  "/api/v1/account/gmail/start",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    log.info("Gmail Auth Called");
    console.log("Gmail Auth called");
    /**
     *  In order to get the refresh token for sure do below
     *
     * accessType: offline
     * prompt: select_account
     *
     * this is super important otherwise refresh token is not coming.
     */

    /**
     *  for typescript below <any> is important
     *  removing those will raise an error.
     *  fixed after 1 hour of Effort.
     */

    /**
     *  scopes are applied by looking up the available scopes and
     *  deciding which one is necessary
     *
     */
    passport.authenticate("loginGmail", <any>{
      session: false,
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.modify",
        "https://www.googleapis.com/auth/gmail.compose",
      ],
      accessType: "offline",
      prompt: "consent",
    })(req, res, next);
  }
);

/**
 *  Call back route
 *   This routes is called by Gmail After successful Auth happened
 */

router.get(
  "/api/v1/account/gmail/redirect",

  passport.authenticate("loginGmail", {
    session: false,
    failureRedirect: `${config.clientUrl}/calendar/mail`,
  }),

  function (req: any, res) {
    const token = req?.user?.emailProviderToken;
    // Successful authentication, redirect home.
    //loading page.

    res.redirect(`${config.clientUrl}/calendar/mail?emailToken=${token}`);
  }
),
  router.get(
    "/api/v1/account/outlook/mail/start",
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      passport.authenticate("loginOutlookMail", {
        session: false,
        scope: [
          "openid",
          "profile",
          "offline_access",
          "https://outlook.office.com/Mail.Read",
          "https://outlook.office.com/Mail.ReadWrite",
          "https://outlook.office.com/Mail.Send",
        ],
      })(req, res, next);
    }
  );

router.get(
  "/api/v1/account/outlook/mail/callback",

  passport.authenticate("loginOutlookMail", {
    session: false,
    failureRedirect: `${config.clientUrl}/calendar/mail`,
  }),
  function (req: any, res) {
    const token = req?.user?.emailProviderToken;

    // Successful authentication, redirect home.
    res.redirect(`${config.clientUrl}/calendar/mail?emailToken=${token}`);
  }
);


export { router as AuthRouter };
