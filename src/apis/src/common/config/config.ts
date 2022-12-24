import {
  CONFIRM_EMAIL_TOKEN_EXPIRY,
  CONFIRM_MAIL,
  INVITE_EXPIRY,
  PASSWORD_RESET_TOKEN_EXPIRY,
  RESET_PASSWORD,
} from "./constant";

const db = require("../../../../database/config/config");

class Config {
  public db = db;

  public logConfig = {
    logFileSize: "10m",
    logMaxFiles: 5,
    logDirectory: "logs",

    // logS3BucketName: process.env.AWS_S3_LOG_FILE_BUCKET
  };

  /**
   *  Port variable
   */

  public port = process.env.PORT;

  /**
   * invitation Expiry for Email Invite
   */

  public inviteExpiry = INVITE_EXPIRY;

  /**
   * Resent Password Expiry for Email Reset in Minutes
   */

  public passwordResetExpiry = PASSWORD_RESET_TOKEN_EXPIRY;

  /**
   * Confirm Mail Expiry
   */

  public emailConfirmExpiry = CONFIRM_EMAIL_TOKEN_EXPIRY;

  /**
   *  Token type
   */

  public token = {
    resetPassword: RESET_PASSWORD,
    confirmMail: CONFIRM_MAIL,
  };

  /**
   *  Client Url
   */
  public clientUrl = process.env.CLIENT_PUBLIC_URL;

  public apiBaseUrl = process.env.API_BASE_URL;

  /**
   * Node environment
   */
  public env = process.env.NODE_ENV;

  public saltRounds = process.env.SALT_ROUNDS;

  /**
   *  Jwt secret key
   */
  public jwtSecretKey = process.env.JWT_SECRET_KEY!;


  /**
   *  Token secret Key
   */

  public tokenSecretKey = process.env.TOKEN_SECRET_KEY;

  /**
   * Email Config Links
   * TODO move to env
   */

  public facebookLink = "https://www.facebook.com/";
  public linkedinLink = "https://www.linkedin.com/";
  public instagramLink = "https://www.instagram.com/";
  public twitterLink = "https://twitter.com/";
  public pinterestLink = "https://www.pinterest.com/";
  public surveyLink = "https://www.google.com/";
  public wsdDigitalEmail = "info@wsddigital.com";

  public currentLocation = process.cwd().split("/").pop();

  public email = {
    username: process.env.EMAIL,
  };

  /**
   *  Google credential Auth Login.
   */

  public google = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    project_id: process.env.GOOGLE_PROJECT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    callback_url: process.env.GOOGLE_CALLBACK_URL,
  };

  /**
   *  Outlook credential Auth Login.
   */

  public outlook = {
    client_id: process.env.OUTLOOK_CLIENT_ID,
    client_secret: process.env.OUTLOOK_CLIENT_SECRET,
    callback_url: process.env.OUTLOOK_CALLBACK_URL,
  };

  /**
   *  Communication API
   */

  public communication_url = process.env.COMMUNICATION_URL;

  public communication_token =
    process.env.COMMUNICATION_UNLEASHED_ACCOUNT_TOKEN;

  /**
   *  S3 Configs
   */

  public s3 = {
    uploadProfileImageBucket: "unleashed-user-profile-images", // to be shifted to env
    userProfileImageDirectory: "staff_images",
    customerProfileImageDirectory: "customer_images",
    groupChatProfileImageDirectory: "groupChat_images",
    tenantLogoDirectory: "tenant_logos",
    tenantFilesDirectory: "tenant_files",
    uploadProfileImageACL: "public-read-write",
    imageContentType: "image/jpeg",
  };

  /**
   *  Payment Gateway Converge Configs
   */

  public converge = {
    ssl_merchant_id: "0022679",
    ssl_user_id: "apiuser",
    ssl_pin: "YXMU2JPOD7AGFMALEG5EE2F8D85YODHYHGL68HWN5W9IAMPX02SZV3AB6SSQX6MU",
  };

  /**
   *  Gmail oAuth Configs
   */

  public gmail = {
    client_id: process.env.GMAIL_CLIENT_ID,
    client_secret: process.env.GMAIL_CLIENT_SECRET,
    callback_url: process.env.GMAIL_CALLBACK_URL,
  };

  public outlook_mail = {
    callback_url: process.env.OUTLOOK_MAIL_CALLBACK_URL,
  };

  constructor() {}
}
export const config = new Config();
