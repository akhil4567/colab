import { log } from '../../common/classes/log.class';
const AWS = require('aws-sdk');

const s3 = new AWS.S3();
AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  region: process.env.AWS_REGION,
});

async function getSignedFileUrl(fileKey: string, bucket: string, expiresIn: number) {
  try {
    let params = {
      Bucket: bucket,
      Key: fileKey,
      Expires: expiresIn
    }
    const url: any = await new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (err: any, url: any) => {
        err ? reject(err) : resolve(url);
      });
    });
    return url;
  } catch (err) {
    if (err) {
      log.error('Error while fetching file URL', err);
      return err;
    }
  }
}

export default getSignedFileUrl;