import { db } from "../../../database/connection";
import { log } from "../common/classes/log.class";
import { getWorkerToken, createNewWorker } from "../common/services/voiceWorker.service";
const Sequelize = db.dbInterface.Sequelize;

class VoiceWorkerDao {
  constructor() { }

  async getWorkerToken(data: any) {
    try {
      const userMappingData = data.user.UserMappings[0];

      if (userMappingData.twilioWorkerSid) {
        log.info("token only for ----> ", userMappingData.twilioWorkerSid);

        const workerToken: any = await getWorkerToken({ 
          tenantId: data.user.lastLoggedTenantId, 
          workerSid: userMappingData.twilioWorkerSid
        });

        return {
          workerToken: workerToken.data,
          workerSid: userMappingData.twilioWorkerSid
        };
      } else {
        log.info("token for NEW Worker.");

        const newWorkerToken: any = await createNewWorker({
          tenantId: data.user.lastLoggedTenantId,
          name: data.user.firstName + ' ' + data.user.lastName,
          userId: data.user.id
        });
        log.info("newWorkerToken --- > ", newWorkerToken);

        const userUpdate = await db.dbInterface.models.UserMapping.update({
          twilioWorkerSid: newWorkerToken.worker.sid
        }, {
          where: {
            userId: data.user.id,
            tenantId: data.user.lastLoggedTenantId
          }
        });

        return {
          workerToken: newWorkerToken.wToken,
          workerSid: newWorkerToken.worker.sid
        };
      }
      // return userMappingData;

    } catch (error: any) {
      log.error("worker token error!!", error);
      throw new Error(error);
    }
  }

  async updateCommunicationVoiceNumber(data: any) {
    try {
      const tenant: any = await db.dbInterface.models.Tenant.update(
        {
          voiceNumberId: data.voiceNumberId,
          voiceNumber: data.voiceNumber,
          updatedBy: data.user.id,
        },
        { where: { id: data.tenantId }, returning: true }
      );
      return tenant[1][0];

    }  catch (error: any) {
      log.error("Voice Number update error!!", error);
      throw new Error(error);
    }
  }
}

export default new VoiceWorkerDao();
