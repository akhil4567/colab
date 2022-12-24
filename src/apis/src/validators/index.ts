import { log } from '../../src/common/classes/log.class';

export { tenantValidation } from './tenant';
export { departmentValidation } from './department';
export { locationValidation } from './location';
export { userValidation } from './user';
export { authValidation , resetPasswordValidationMail, resetPasswordValidation,addPasswordValidation } from './auth'
export { customerValidation} from './customer';
export { planValidation } from './plan';
export { featureValidation } from './feature';
export { engagementTypeValidation } from "./engagementType";
export { onboardingTenantValidation } from './onboardingTenant';
export { roleValidation } from './role';
export { permissionValidation } from './permission';
export {emailTemplateValidation} from './template'
export {smsTemplateValidation} from './template'
export {userProfileValidation} from './userProfile'
export {tenantConfigValidation} from './tenantConfig';
export { documentValidation } from './document';
export {outlookSendValidation , outlookReplyValidation , outlookForwardValidation} from "./outlook"
export {gmailSendValidation , gmailReplyValidation} from "./gmail"

export const parseError = (err : any, req :any, res : any, next : any) => {
    log.warn('error', err);
    return res.status(err.statusCode || 500).json(err)
  }