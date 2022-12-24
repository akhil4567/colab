import passport from "passport";
import { config } from "../config/config";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
var OutlookStrategy = require("passport-outlook").Strategy;
import { Strategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import UserDao from "../../daos/user.dao";
import { token } from "../classes/token.class";
import EmailProviderDao from "../../daos/emailProvider.dao";
import { cryptoCypher } from "../classes/cryptoCypher.class";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email: any, password: any, cb: any) {
      // password = await bcrypt.hash(password , parseInt(config.saltRounds!))

      return UserDao.findOneUser(email)
        .then(async (user) => {
          if (!user) {
            return cb(null, false, { message: "Incorrect email or password." });
          }

          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return cb(null, false, { message: "Incorrect email or password." });
          }

          return cb(null, user, { message: "Logged In Successfully" });
        })
        .catch((err) => cb(null, false, err));
    }
  )
);

/**
 * Invite User authentication User for Get-invite User details.
 */

passport.use(
  "inviteJwt",
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecretKey,
    },
    async function (jwtPayload, cb) {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.

      try {
        const user = await UserDao.findUserById(jwtPayload.id);
        if (!user) {
          return cb("Auth Error , User is not found.");
        }

        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

/**
 * Normal Jwt strategy Auth middleware.
 */

passport.use(
  "authJwt",
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecretKey,
    },
    async function (jwtPayload, cb) {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.

      try {
        const user: any = await UserDao.findUserById(jwtPayload.id);
        if (!user) {
          return cb("Auth Error , User is not found.");
        }
        user["tenantId"] = user.lastLoggedTenantId;

        /**
         *  check if the user is authenticated before else throw error.
         */

        if (
          user.password === null &&
          user.googleId === null &&
          user.outlookId === null
        ) {
          return cb("Auth Error , User not Authenticated.");
        }

        user.UserMappings.forEach((item: any) => {
          if (item.tenantId == user.lastLoggedTenantId) {
            if (item.roleId != null) user.dataValues["roleId"] = item.roleId;
            else user.dataValues["roleId"] = null;
          }
        });
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);
passport.serializeUser(function (user, done) {
  if (user) done(null, user);
});

passport.deserializeUser(function (id: any, done) {
  done(null, id);
});
/**
 *  Login Google
 */

passport.use(
  "loginGoogle",
  new GoogleStrategy(
    {
      clientID: config.google.client_id!,
      clientSecret: config.google.client_secret!,
      callbackURL: config.google.callback_url,
    },
    async function (accessToken: any, refreshToken: any, profile: any, cb) {
      try {

        const encryptedRefreshToken = cryptoCypher.encryptRefreshToken(refreshToken)

        let user = await UserDao.findGoogleUser(profile.id);
        if (!user) {
          //NOTE ->> Temporary solution problem because of unique constraint and soft deletion is causing issue.
          // work around will be taking all the user who are deleted
          user = await UserDao.findOneUserWithEmail(profile.emails[0]?.value);

          if (user) {
            const updateUser = await UserDao.updateSocialProfileId(
              { googleId: profile.id , deletedAt:null  , refreshToken:encryptedRefreshToken , emailVerified: true},
              profile.emails[0]?.value
            );
          }
        }
        if (!user) {
          const userInfoData = {
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            email: profile.emails[0]?.value,
            emailVerified: true,
            googleId: profile.id,
            refreshToken: encryptedRefreshToken,
          };
          user = await UserDao.signupSocialUser(userInfoData);
        }
        const jwtToken = token.generateJwtToken(user.id);
        return cb(null, { token: jwtToken });
      } catch (error: any) {
        cb(error);
      }
    }
  )
);

/**
 * Login outlook
 */

passport.use(
  "loginOutlook",
  new OutlookStrategy(
    {
      clientID: config.outlook.client_id,
      clientSecret: config.outlook.client_secret,
      callbackURL: config.outlook.callback_url,
    },
    async function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {
      try {
        const encryptedRefreshToken = cryptoCypher.encryptRefreshToken(refreshToken)

        let user = await UserDao.findOutlookUser(profile.id);
        if (!user) {
          //NOTE ->> Temporary solution problem because of unique constraint and soft deletion is causing issue.
          // work around will be taking all the user who are deleted also.
          user = await UserDao.findOneUserWithEmail(profile.emails[0]?.value);

          if (user) {

            // and in update we will unDelete that user.
            const updateUser  = await UserDao.updateSocialProfileId(
              { outlookId: profile.id , deletedAt:null , refreshToken:encryptedRefreshToken, emailVerified: true },
              profile.emails[0]?.value
            );
          }
        }
        if (!user) {
          let [firstName, ...lastName] = profile.displayName.split(" ");
          lastName = lastName.join(" ");
          const userInfoData = {
            firstName,
            lastName,
            email: profile.emails[0]?.value,
            emailVerified: true,
            outlookId: profile.id,
            refreshToken: encryptedRefreshToken,
          };
          user = await UserDao.signupSocialUser(userInfoData);
        }

        const jwtToken = token.generateJwtToken(user.id);
        return done(null, { token: jwtToken });
      } catch (error: any) {
        done(error);
      }
    }
  )
);

/**
 *  Login Gmail oAuth.
 */

passport.use(
  "loginGmail",
  new GoogleStrategy(
    {
      clientID: config.gmail.client_id!,
      clientSecret: config.gmail.client_secret!,
      callbackURL: config.gmail.callback_url,
    },
    async function (accessToken: any, refreshToken: any, profile: any, cb) {
      try {

       const encryptedRefreshToken = cryptoCypher.encryptRefreshToken(refreshToken)

        


        let emailProvider : any = await EmailProviderDao.findEmailProvider(profile.emails[0]?.value);
        if (emailProvider) {
          
          const updateEmailProvider = await EmailProviderDao.updateRefreshToken({refreshToken: encryptedRefreshToken  , id: emailProvider.id});

    
        }else{
           
          emailProvider  = await EmailProviderDao.createEmailProvider({
            name: `${profile.name?.givenName} Gmail`,
            provider: "gmail",
            status: "active",
            email: profile.emails[0]?.value,            
            refreshToken: encryptedRefreshToken,
          });
        }
        const jwtToken = token.generateJwtToken(emailProvider.id);

        return cb(null, { emailProviderToken: jwtToken });
      } catch (error: any) {
        cb(error);
      }
    }
  )
);

/**
 *  All the client Id and secret is same as outlook oAuth
 * But the call back url is different
 */

passport.use(
  "loginOutlookMail",
  new OutlookStrategy(
    {
      clientID: config.outlook.client_id,
      clientSecret: config.outlook.client_secret,
      /**
       * call back url is different so Azure will call the specified call back
       * url
       */
      callbackURL: config.outlook_mail.callback_url,
    },
    async function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {
      try {

        const encryptedRefreshToken = cryptoCypher.encryptRefreshToken(refreshToken)
        
        let emailProvider : any = await EmailProviderDao.findEmailProvider(profile.emails[0]?.value);
        let [firstName, ...lastName] = profile.displayName.split(" ");

        if (emailProvider) {
          
          const updateEmailProvider = await EmailProviderDao.updateRefreshToken({refreshToken:encryptedRefreshToken , id: emailProvider.id});

    
        }else{
           
          emailProvider  = await EmailProviderDao.createEmailProvider({
            name: `${firstName} Outlook`,
            provider: "outlook",
            status: "active",
            email: profile.emails[0]?.value,            
            refreshToken:encryptedRefreshToken,
          });
        }
        const jwtToken = token.generateJwtToken(emailProvider.id);

        return done(null, { emailProviderToken: jwtToken });
      } catch (error: any) {
        done(error);
      }
    }
  )
);
