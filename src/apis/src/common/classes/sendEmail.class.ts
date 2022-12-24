import { config } from "../config/config";




const nodemailer = require("nodemailer");
let AWS = require('aws-sdk');



AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region
  });


    

export class EmailClass {

    private email: any = null;

    private transporter = nodemailer.createTransport({
        SES: new AWS.SES({
          apiVersion: '2010-12-01'
        })
        });

     //configure AWS 

    /**
     * Sends email to outside world.
     * @param payload : IEmailPayload
     * @returns a promise.
     */
    public async sendEmail(payload: IEmailPayload): Promise<any> {
        console.log('\n::::sending email to ', payload.to, payload.subject);

        if (!payload.to) {
            console.log('\n Email is not sent. EmailID is empty \n');
            return Promise.resolve('email not sent');
        }

        let info;
        try {
            info = await this.transporter.sendMail({
                from: config.email.username, // sender address
                to: payload.to, // list of receivers
                subject: payload.subject, // Subject line
                html:payload.html
                // html: payload.htmlBody,
                // attachments: payload.attachment || []
            });

            console.log("Message sent: %s", info.messageId);

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch (e) {
            console.log('Error sending email: ', e, payload);
            return Promise.reject(e);
        }

        return info;
    }

}

/**
 * Singleton object which can send emails to outside world.
 */
export const Email = new EmailClass();

export interface IEmailPayload {
    to:Array<string>,
    subject:string,
    html: string
    
    //htmlBody: string,
    // attachment?: Array<any>
}



