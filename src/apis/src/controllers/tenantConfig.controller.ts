import express from 'express';
import {config} from "../common/config/config"
import TenantConfigDao from '../daos/tenantConfig.dao';
import TenantDao from "../daos/tenant.dao";
const AWS = require("aws-sdk");
AWS.config = new AWS.Config({
  accessKeyId: process.env.pinpointAccessKeyId,
  secretAccessKey: process.env.pinpointSecretAccessKey,
  region: process.env.awsRegion,
});

class TenantConfigController {

    async getTenantConfig(req: express.Request, res: express.Response) {
        const result = await TenantConfigDao.getTenantConfig({
            id: req.params.id,
            user: req.user
        });
        return result;
    }

    async getDeletedTenantConfigs(req: express.Request, res: express.Response) {
        const result = await TenantConfigDao.getDeletedTenantConfigs({
            limit: req.query.limit || 20,
            offset: req.query.page || 1
        });
        return result;
    }

    async updateOrCreateTenantConfig(req: express.Request, res: express.Response) {
        const user: any = req.user
        const file_data: any = req.file;
        let logoURL = null;
        if(file_data){
            // If image file is being sent in the body, storing the image in S3 bucket
            const s3 = new AWS.S3({
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
            });

            const tenant: any = await TenantDao.getTenantDetails({
              id: req.query.tenantId
            });
            const tenantName = tenant.dataValues.name
            /**
             * Params that are passed for S3 file Upload function
             */
            const params = {
            Bucket: config.s3.uploadProfileImageBucket,
            Key:`${tenantName}/${config.s3.tenantLogoDirectory}/${req.query.tenantId}`,
            Body:file_data.buffer,
            ACL:config.s3.uploadProfileImageACL,
            ContentType:config.s3.imageContentType
            };

            /**
             * Uploading image into S3 bucket
             */
            const s3_upload_data: any =  await new Promise((resolve) => {
            s3.upload(params, function (error: any, data: any) {
                resolve({ error, data });
            });
            });
            logoURL = s3_upload_data.data.Location
        }

        const foundTenantConfig: any = await TenantConfigDao.findOneTenantConfig(req.query.tenantId);
        if (!foundTenantConfig){
            // Tenant Configuration not found, creating a new one
            const result = await TenantConfigDao.createTenantConfig({
                ...req.body,
                logoURL: logoURL,
                user: req.user,
                tenantId: req.query.tenantId
            });
            return result;
        }
        // Tenant Configuration found, updating it
        if(!file_data){
            logoURL = foundTenantConfig.dataValues.logo;
        }
        const result = await TenantConfigDao.updateTenantConfig({
            ...req.body,
            logoURL: logoURL,
            user: req.user,
            tenantId: req.query.tenantId,
        });
        return result;
    }

    async deleteTenantConfig(req: express.Request, res: express.Response) {
        const result = await TenantConfigDao.deleteTenantConfig({
            ...req.body,
            user: req.user,
            tenantId: req.params.id,
        });
        return result;
    }
}

export default new TenantConfigController();
