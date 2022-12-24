import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface UserProfileAttributes {
  id?: string,
  gridItems: object,
  gridLayout: object,
  createdBy?: string,
  updatedBy?: string,
  deletedAt?: string,

};





export class UserProfile extends Model<UserProfileAttributes> {
  static associate(models: any) {
    UserProfile.hasMany(models.UserMapping, { foreignKey: 'profileId'});
   
    UserProfile.belongsTo(models.User, { foreignKey: 'createdBy' });
    UserProfile.belongsTo(models.User, { foreignKey: 'updatedBy' });
    
}
}

const UserProfileFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof UserProfile => {

  UserProfile.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    gridItems: dataTypes.JSON,
    gridLayout:dataTypes.JSON,
    createdBy: dataTypes.UUID,
    updatedBy: dataTypes.UUID,
  }, {
    sequelize,
    modelName: 'UserProfile',
    paranoid: true
  });

  return UserProfile;
};

export default UserProfileFactory