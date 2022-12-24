import { Sequelize, Model, DataTypes, UUIDV4 } from "sequelize";

export interface UserAttributes {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  contactNumber?: string;
  refreshToken?: string;
  outlookId?: string;
  googleId?: string;
  lastLoggedTenantId?: string;
  emailVerified?: boolean;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
}

export class User extends Model<UserAttributes> {
  static associate(models: any) {
    User.hasMany(models.UserMapping, { foreignKey: "userId"  });
    User.belongsTo(models.User, { foreignKey: "createdBy" });
    User.belongsTo(models.User, { foreignKey: "updatedBy" });
    // User.belongsToMany(models.Project, { as: 'projects', through: 'UserProjectMapping', foreignKey: 'userId' });
    User.belongsTo(models.Tenant, { foreignKey: "lastLoggedTenantId" });
    User.belongsToMany(models.StaffEngagement, {
      through: "StaffEngagementUserMappings",
      foreignKey: "userId",
      as: "staffEngagements",
    });
    User.hasMany(models.StaffEngagementUserMapping, {
      foreignKey: "userId",
      as: "userMappings",
    });

    User.belongsToMany(models.ChatRoom, {
      through: "ChatRoomMappings",
      foreignKey: "userId",
      as: "chatRooms",
    });
    User.hasMany(models.ChatRoomMapping, {
      foreignKey: "userId",
      as: "chatRoomUserMappings",
    });
  }
}

const userFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof User => {
  User.init(
    {
      id: {
        type: dataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      password: dataTypes.STRING,
      firstName: dataTypes.STRING,
      lastName: dataTypes.STRING,
      email: dataTypes.STRING,
      lastLoggedTenantId: dataTypes.UUID,
      contactNumber: dataTypes.STRING,
      refreshToken: dataTypes.STRING(1000),
      googleId: dataTypes.STRING,
      outlookId: dataTypes.STRING,
      emailVerified: dataTypes.BOOLEAN,
      createdBy: dataTypes.UUID,
      updatedBy: dataTypes.UUID,
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true,
    }
  );

  return User;
};

export default userFactory;
