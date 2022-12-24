import express  from 'express';
import * as socketio from 'socket.io';
import jwt from "jsonwebtoken";
import session from "express-session";

import './src/common/services/passport';
import cors from "cors";
import passport from 'passport';
import { Email } from './src/common/classes/sendEmail.class';
import { token } from './src/common/classes/token.class';
import { config } from './src/common/config/config';
import { EmailComposer } from './src/common/classes/email-composer.class';
import WebSocketController from './src/controllers/websocket.controller';
import CronHelper from './src/common/classes/cron-helper.class'
import WebSocket from './src/common/classes/socket-connection.class';

import { db } from '../database/connection';
import { UserRouter } from './src/routes/user.routes';
import { LocationRouter } from './src/routes/location.routes';
import { SlotRouter } from './src/routes/slot.routes';
import { log } from './src/common/classes/log.class';
import { DepartmentRouter } from './src/routes/department.routes';
import { TenantRouter } from './src/routes/tenant.routes';
import { CustomerRouter } from './src/routes/customer.routes'
import { AuthRouter } from './src/routes/auth.route';
import { StaffEngagementRouter } from './src/routes/staffEngagement.routes';
import { PlanRouter } from './src/routes/plan.routes';
import { FeatureRouter } from './src/routes/feature.routes';
import { RoleRouter } from './src/routes/role.routes';
import { PermissionRouter } from './src/routes/permission.routes';
import { ReportRouter } from './src/routes/report.routes';
import { EngagementTypeRouter } from './src/routes/engagementType.routes';
import { PublicRouter } from './src/routes/public.routes';
import { EngagementRouter } from './src/routes/engagement.route';
import { EmailTemplateRouter } from './src/routes/emailTemplate.route';
import { SmsTemplateRouter } from './src/routes/smsTemplate.route';
import { UserProfileRouter } from './src/routes/userProfile.route';
import { TenantConfigRouter } from './src/routes/tenantConfiguration.routes';
import { websocketRouter} from './src/routes/webSocket.route';
import { EmailProviderRouter } from './src/routes/emailProvider.routes';
import { EmailRouter } from './src/routes/email.routes';
import {notificationRouter} from './src/routes/notification.routes';
import { PaymentGatewayRouter } from './src/routes/paymentGateway.routes';
import { DocumentRouter } from './src/routes/document.routes';
import { VoiceWorkerRouter } from './src/routes/voiceWorker.routes';
import { InternalChatRouter } from './src/routes/internalChats.routes';
import websocketController from './src/controllers/websocket.controller';
import e from 'express';

const init = async () => {
  const app = express();
  let http = require("http").Server(app);
  
 

  const router = express.Router()
  app.use(express.json());
  app.use(cors())
  app.use(passport.initialize())
  const sessionMiddleware = session({
    secret: config.jwtSecretKey,
    resave: false,
    saveUninitialized: false
  });
  app.use(sessionMiddleware);
  app.use(config.apiBaseUrl!, router);

  app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send({ message: "ok" });
  });





  app.use(UserRouter,
     DepartmentRouter, 
     LocationRouter, 
     TenantRouter, 
     SlotRouter, 
     CustomerRouter, 
     AuthRouter, 
     PlanRouter, 
     EngagementTypeRouter, 
     FeatureRouter , 
     PublicRouter, 
     StaffEngagementRouter, 
     RoleRouter, 
     PermissionRouter, 
     EngagementRouter , 
     EmailTemplateRouter , 
     SmsTemplateRouter , 
     UserProfileRouter, 
     ReportRouter,
     websocketRouter,
     EmailProviderRouter,
     notificationRouter,
     TenantConfigRouter,
     PaymentGatewayRouter,
     EmailRouter,
     DocumentRouter,
     VoiceWorkerRouter,
     InternalChatRouter,
    );


  app.all("*", (req: express.Request, res: express.Response) => {
    res.status(404).send({ error: "unknown path for services." });
  });
  
  /*
  * cron job
  */
  // new CronHelper()

  const server = http.listen(config.port, () => {
    log.info(`Listening on port ${config.port}`);
  });
  /*
  * web socket connect
  */

  new WebSocket(app,server,sessionMiddleware);

};

db.connect()
  .then(() => {
    log.info("db connected");
    init();
  })
  .catch((err: Object) => {
    log.info("Error connecting database: ", err);
  });
