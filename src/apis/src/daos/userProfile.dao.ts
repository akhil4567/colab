import { use } from 'passport';
import { db } from '../../../database/connection';
import { log } from "../common/classes/log.class";
const Sequelize = db.dbInterface.Sequelize;

class UserProfileDao {
  constructor() {
    
  }


  

  async createUserProfile(data: any) {
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const userProfile: any = await db.dbInterface.models.UserProfile.create({
          gridItems: data.gridItems,
          gridLayout: data.gridLayout,
          createdBy: data.user.id,
          updatedBy: data.user.id,
        }, { transaction } );
      
      
      

       const mappingRes : any = await db.dbInterface.models.UserMapping.update({profileId:userProfile.id},{where:{userId:data.user.id , tenantId:data.user.tenantId}, transaction })
      log.info("User Mapping Response  -- ",JSON.parse(JSON.stringify(mappingRes)));
        
      

      await transaction.commit();
      log.info("Role Created Successfully",userProfile);
      return userProfile;

    }
    catch(error:any){
      await transaction.rollback();
      log.info("Error !!!",error);
      throw new Error(error);
    }
  }


  async updateUserProfile(data: any) {

   
      const userProfile: any = await db.dbInterface.models.UserProfile.update({
          gridItems: data.gridItems,
          gridLayout: data.gridLayout,
          updatedBy: data.user.id,
        }, { where:{id:data.id},  } );
      
      
      

       
        
      

      return userProfile;

  
  }

}

export default new UserProfileDao();