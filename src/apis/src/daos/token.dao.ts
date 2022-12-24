import { db } from "../../../database/connection";
import { log } from "../common/classes/log.class";
const { Op } = require("sequelize");
const Sequelize = db.dbInterface.Sequelize;

class TokenDao {
  constructor() {
    // log('Created new instance of Dao');
  }

  async getToken(data: any ) {
    const attributesExclusions = [
      "createdBy",
      "updatedBy",
      "deletedAt",
      "createdAt",
      "updatedAt",
    ];
    const token: any =
      await db.dbInterface.models.Token.findOne({
       
        attributes: {
          exclude: attributesExclusions,
        },
        include:[
          {
            model: db.dbInterface.models.User,
            as: 'user'
          }
        ],
        where: {
          tokenSecret: data.tokenSecret , type:data.type,expiry :{[Op.gte]: data.expiry }
        },
      });

    return token;
  }

  async createToken(data: any) {
    const Token: any = await db.dbInterface.models.Token.create({
      tokenSecret: data.tokenSecret,
      userId: data.user.id,
      type: data.type,
      expiry: data.expiry,
      createdBy: data.user.id,
    });

    log.info("Token Created Successfully", Token);
    return Token;
  }



  async deleteToken(data:any){
    const transaction = await db.dbInterface.sequelize.transaction();
    try {
      const updateLog : any = await db.dbInterface.models.Token.update({
        updatedBy:data.userId,
      },{
        where:{id:data.id , type: data.type} , transaction
      })

      log.info("Token Update ----> " , JSON.stringify(updateLog))

      const token: any = await db.dbInterface.models.Token.destroy({
        where : {id:data.id , type: data.type} , transaction
      })

      log.info("Token (Destroy) ---- > ", JSON.stringify(token))

      await transaction.commit();

      return token;
    } catch (error:any) {
     await transaction.rollback();
     log.info("Error !!! " , error)
     throw error; 
    }
  }
}

export default new TokenDao();
