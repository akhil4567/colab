import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { log } from "../classes/log.class";


const authMiddleware = passport.authenticate("authJwt", { session: false });

export default authMiddleware;
