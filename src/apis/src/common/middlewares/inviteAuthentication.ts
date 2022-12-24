import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { log } from "../classes/log.class";


const inviteAuthMiddleware = passport.authenticate("inviteJwt", { session: false });

export default inviteAuthMiddleware;
