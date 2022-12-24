import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface UserMappingAttributes {
  id?: string,
  userId: string,
  tenantId: string,
  roleId?: string,
  status: string,
  inviteStatus?: string,
  inviteExpiry?:string,
  departmentId?: string,
  locationId?: string,
  profileId?:string,
  profileImage?: string,
  deletedAt?: string,
  twilioWorkerSid?: string,
};

export class UserMapping extends Model<UserMappingAttributes> {
  static associate(models: any) {
    UserMapping.belongsTo(models.User, { foreignKey: 'userId' });
    UserMapping.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
    UserMapping.belongsTo(models.Role, { foreignKey: 'roleId'});
    UserMapping.belongsTo(models.UserProfile, { foreignKey: 'profileId'});
    UserMapping.belongsTo(models.Department, { foreignKey: 'departmentId' });
    UserMapping.belongsTo(models.Location, { foreignKey: 'locationId' });
  }
}

const userMappingFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof UserMapping => {

  UserMapping.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    userId: dataTypes.UUID,
    tenantId: dataTypes.UUID,
    status: dataTypes.ENUM('active','inactive'),
    inviteStatus: dataTypes.ENUM('accept','pending','reject'),
    inviteExpiry: dataTypes.DATE,
    roleId: dataTypes.UUID,
    departmentId: dataTypes.UUID,
    locationId: dataTypes.UUID,    
    profileId:dataTypes.UUID,
    profileImage: dataTypes.STRING,
    twilioWorkerSid: dataTypes.STRING,
  }, {
    sequelize,
    modelName: 'UserMapping',
    paranoid: true
  });

  return UserMapping;
};


export default userMappingFactory;