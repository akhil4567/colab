const Handlebars = require("handlebars");

import { config } from "../config/config";
import {joinReframeEmail} from "../templates/email/join-reframe";
import {verifyEmail} from "../templates/email/verify-email";
import {register2faEmail} from "../templates/email/register2fa-email";
import { passwordReset } from "../templates/email/password-reset";


export class EmailComposerClass {
    private data: any = {
        surveyLink: config.surveyLink,
        facebookLink: config.facebookLink,
        linkedinLink: config.linkedinLink,
        instagramLink: config.instagramLink,
        twitterLink: config.twitterLink,
        pinterestLink: config.pinterestLink,
        wsdDigitalEmail:config.wsdDigitalEmail,
        loginLink: config.clientUrl+'/auth',
    }

    public composeJoinReframeEmail(payload: {
        userName: string,
        inviteLink: string,      
        invitationValidity: string,
        
    }): string {
        let hdData = { ...this.data, ...payload };
        return Handlebars.compile(joinReframeEmail)(hdData);
    }

    public composeVerifyEmail(payload: {
        userName: string,
        userEmail: string,
        emailConfirmExpiry: string,
        confirmMailLink: string,
        uiUrl?: string,
    }): string {
        let hdData = { ...this.data, ...payload };
        return Handlebars.compile(verifyEmail)(hdData);
    }

    public composeregister2faEmail(payload: {
        userName: string,
        otp: string,
        otpValidity: string,
        uiUrl?: string,
    }): string {
        let hdData = { ...this.data, ...payload };
        return Handlebars.compile(register2faEmail)(hdData);
    }

    public composeResetPasswordEmail(payload: {
        userName: string,
        resetPasswordLink?: string,
        resetPasswordLinkValidity?: string,
    }): string {
        let hdData = { ...this.data, ...payload };
        return Handlebars.compile(passwordReset)(hdData);
    }

 

}

export const EmailComposer = new EmailComposerClass();