import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface PermissionAttributes {
  id?: string,
  key: string,
  name: string,
  description: string,
  featureId?: string,
  createdBy: string,
  updatedBy: string,
  deletedAt?: string,
}

export class Permission extends Model<PermissionAttributes> {

  static associate(models: any) {
    Permission.belongsToMany(models.Role, {
      through: "RolePermissionMappings",
      foreignKey: "permissionId",
    });
    Permission.belongsTo(models.Feature, { foreignKey: 'featureId' });
    Permission.belongsTo(models.User, { foreignKey: 'createdBy' });
    Permission.belongsTo(models.User, { foreignKey: 'updatedBy' });
  }
}

const permissionFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof Permission => {
  Permission.init(
    {
      id: {
        type: dataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      key: dataTypes.STRING,
      name: dataTypes.STRING,
      description: dataTypes.STRING,
      featureId: dataTypes.UUID,
      createdBy: dataTypes.UUID,
      updatedBy: dataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'Permission',
      paranoid: true
    }
  );

  return Permission;
};

export default permissionFactory;
