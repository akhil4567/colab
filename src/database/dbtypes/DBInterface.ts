import { User } from "../models/user";
import { Role } from "../models/role";
import { Slot } from "../models/slot";
import { SlotException } from "../models/slotException";
import { Holiday } from "../models/holiday";
import { Tenant } from "../models/tenant";
import { Department } from "../models/department";
import { Location } from "../models/location";
import { LocationDepartmentMapping } from "../models/locationDepartmentMapping";
import { Customer } from "../models/customer";
import { EngagementType } from "../models/engagementType";
import { Plan } from "../models/plan";
import { Feature } from "../models/feature";
import { PlanFeatureMapping } from "../models/planFeatureMapping";
import { Permission } from "../models/permission";
import { RolePermissionMapping } from "../models/rolePermissionMapping";
import { UserMapping } from "../models/userMapping";
import { StaffEngagement } from "../models/staffEngagement";
import { StaffEngagementException } from "../models/staffEngagementException";
import { StaffEngagementUserMapping } from "../models/staffEngagementUserMapping";
import { Engagement } from "../models/engagement";
import { EmailTemplate } from "../models/emailTemplate";
import { SmsTemplate } from "../models/smsTemplate";
import { UserProfile } from "../models/userProfile";
import { TenantConfiguration } from "../models/tenantConfiguration";
import {Notification} from "../models/notification";
import { ChatRoom } from "../models/chatRoom";
import { ChatRoomMapping } from "../models/chatRoomMapping";
import { Message } from "../models/message";
import { EmailProvider } from "../models/emailProvider";
import { UserConnection } from "../models/userConnection";
import { Token } from "../models/token";
import { Document } from "../models/document";
export interface DbInterface {
    sequelize: any;
    Sequelize: any;
    models: {
        User:typeof User,
        Role: typeof Role,
        Tenant: typeof Tenant,
        Department: typeof Department,
        Location: typeof Location,
        LocationDepartmentMapping: typeof LocationDepartmentMapping,
        Customer: typeof Customer
        EngagementType: typeof EngagementType,
        Slot: typeof Slot,
        SlotException: typeof SlotException,
        Holiday: typeof Holiday,
        Plan: typeof Plan,
        Feature: typeof Feature,
        PlanFeatureMapping: typeof PlanFeatureMapping,
        Permission: typeof Permission,
        RolePermissionMapping: typeof RolePermissionMapping,
        UserMapping: typeof UserMapping,
        StaffEngagement: typeof StaffEngagement,
        StaffEngagementException: typeof StaffEngagementException,
        StaffEngagementUserMapping: typeof StaffEngagementUserMapping,
        Engagement: typeof Engagement,
        EmailTemplate: typeof EmailTemplate,
        SmsTemplate : typeof SmsTemplate,
        UserProfile : typeof UserProfile,
        TenantConfiguration: typeof TenantConfiguration,
        Notification: typeof Notification,
        ChatRoom: typeof ChatRoom;
        ChatRoomMapping: typeof ChatRoomMapping;
        Message: typeof Message;
        EmailProvider : typeof EmailProvider;
        UserConnection: typeof UserConnection;
        Token : typeof Token;
        Document: typeof Document;
    }
}




