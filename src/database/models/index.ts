"use strict";
const config = require("../config/config");
import { Sequelize, DataTypes } from 'sequelize';
import { DbInterface } from '../dbtypes/DBInterface';
import departmentFactory from './department';
import RoleFactory from './role';
import tenantFactory from './tenant';
import userFactory from './user';
import locationFactory from './location';
import locationDepartmentMappingFactory from './locationDepartmentMapping';
import EngagementTypeFactory from './engagementType';
import SlotFactory from './slot';
import SlotExceptionFactory from './slotException';
import HolidayFactory from './holiday';
import customerFactory from './customer';
import planFactory from './plan';
import featureFactory from './feature';
import planFeatureMappingFactory from './planFeatureMapping';
import permissionFactory from './permission';
import rolePermissionMappingFactory from './rolePermissionMapping';
import userMappingFactory from './userMapping';
import StaffEngagementExceptionFactory from './staffEngagementException';
import StaffEngagementFactory from './staffEngagement';
import StaffEngagementUserMappingFactory from './staffEngagementUserMapping';
import EngagementFactory from './engagement';
import smsTemplateFactory from './smsTemplate';
import emailTemplateFactory from './emailTemplate';
import UserProfileFactory from './userProfile';
import tenantConfigurationFactory from './tenantConfiguration';
import chatRoomFactory from "./chatRoom";
import chatRoomMappingFactory from "./chatRoomMapping";
import messageFactory from "./message";
import emailProviderFactory from './emailProvider';
import notificationFactory from './notification';
import userConnectionFactory from './userConnection';
import TokenFactory from './token';
import documentFactory from './document';

const sequelize: Sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect as any
});



export const createModels = (sequelize: Sequelize): DbInterface => {


  const db: DbInterface = {
    sequelize,
    Sequelize,
    models: {
      User: userFactory(sequelize, DataTypes),
      Role: RoleFactory(sequelize, DataTypes),
      Tenant: tenantFactory(sequelize, DataTypes),
      Department: departmentFactory(sequelize, DataTypes),
      Location: locationFactory(sequelize, DataTypes),
      LocationDepartmentMapping: locationDepartmentMappingFactory(
        sequelize,
        DataTypes
      ),
      Customer: customerFactory(sequelize, DataTypes),
      EngagementType: EngagementTypeFactory(sequelize, DataTypes),
      Slot: SlotFactory(sequelize, DataTypes),
      SlotException: SlotExceptionFactory(sequelize, DataTypes),
      Holiday: HolidayFactory(sequelize, DataTypes),
      Plan: planFactory(sequelize, DataTypes),
      Feature: featureFactory(sequelize, DataTypes),
      PlanFeatureMapping: planFeatureMappingFactory(sequelize, DataTypes),
      Permission: permissionFactory(sequelize, DataTypes),
      RolePermissionMapping: rolePermissionMappingFactory(sequelize, DataTypes),
      UserMapping: userMappingFactory(sequelize, DataTypes),
      StaffEngagement: StaffEngagementFactory(sequelize, DataTypes),
      StaffEngagementException: StaffEngagementExceptionFactory(
        sequelize,
        DataTypes
      ),
      StaffEngagementUserMapping: StaffEngagementUserMappingFactory(
        sequelize,
        DataTypes
      ),
      Engagement: EngagementFactory(sequelize, DataTypes),
      SmsTemplate: smsTemplateFactory(sequelize, DataTypes),
      EmailTemplate: emailTemplateFactory(sequelize, DataTypes),
      UserProfile: UserProfileFactory(sequelize, DataTypes),
      EmailProvider: emailProviderFactory(sequelize , DataTypes),
      TenantConfiguration: tenantConfigurationFactory(sequelize, DataTypes),
      Notification: notificationFactory(sequelize, DataTypes),
      ChatRoom: chatRoomFactory(sequelize, DataTypes),
      ChatRoomMapping: chatRoomMappingFactory(sequelize, DataTypes),
      Message: messageFactory(sequelize, DataTypes),
      UserConnection: userConnectionFactory(sequelize,DataTypes),
      Token : TokenFactory(sequelize , DataTypes),
      Document : documentFactory(sequelize, DataTypes),
    }
  }


  for (let model in db.models as any) {
    let m = (db.models as any)[model];
    if (m.associate) {
      m.associate(db.models);
    }
  }

  return db;
};
