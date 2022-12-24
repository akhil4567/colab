import express from 'express';
import EmailProviderDao from '../daos/emailProvider.dao';
import { token } from '../common/classes/token.class';
import { outlookHelper } from '../common/services/outlook';
import { gmailHelper } from '../common/services/gmail';


class EmailProviderController {

    async getAllProvider(req: express.Request, res: express.Response) {
        const result = await EmailProviderDao.getAllProvider({
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            user: req.user
        });
        return result;
    }

    async getDeletedEmailProviders(req: express.Request, res: express.Response) {
        const result = await EmailProviderDao.getDeleteEmailProvider({
            limit: req.query.limit || 20,
            offset: req.query.page || 1,
            user: req.user
        });
        return result;
    }

   

    async updateEmailProvider(req: express.Request, res: express.Response) {


        let decoded  : any= token.decodeToken(req.body.token) 
        
        const result = await EmailProviderDao.updateUserId({
            id: decoded.id , 
            user: req.user
         
        });
        return result;
    }

    async deleteEmailProvider(req: express.Request, res: express.Response) {

        const provider  = req.query.provider
        const email = req.query.email as string

        if(!email){
            throw new Error("Email is Required")
        }else if(!provider){
            throw new Error("Provider is Required")
        }


        let revokeOAuthToken;

        const emailProvider = await EmailProviderDao.findEmailProvider(email);

        if(!emailProvider ){
            throw new Error("Given Email is not Found")
        }else if(emailProvider.provider !== provider){
            throw new Error("Provider name mismatch")
        }

        // if(provider == "outlook"){
        //     revokeOAuthToken = await outlookHelper.deleteAllRefreshToken(emailProvider.refreshToken)
            

        // }else if(provider == "google"){
        //     revokeOAuthToken = await gmailHelper.revokeToken(emailProvider.refreshToken)
        // }




        const result = await EmailProviderDao.deleteEmailProvider({
            id: emailProvider.id,
            user: req.user
        
        });
        return result;
    }
}

export default new EmailProviderController();
