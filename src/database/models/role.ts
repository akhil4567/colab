import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface RoleAttributes {
  id?: string,
  roleName: string,
  description: string,
  tenantId: string,
  createdBy: string,
  updatedBy: string,
};

export class Role extends Model<RoleAttributes> {

  static associate(models: any) {
    Role.belongsToMany(models.Permission, {
      through: 'RolePermissionMappings', foreignKey: 'roleId'
    });
    Role.hasMany(models.UserMapping, { foreignKey: 'roleId'});
    Role.belongsTo(models.Tenant, { foreignKey: 'tenantId'});
    Role.belongsTo(models.User, { foreignKey: 'createdBy' });
    Role.belongsTo(models.User, { foreignKey: 'updatedBy' });
  }
}

const RoleFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Role => {

  Role.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    roleName: dataTypes.STRING,
    description: dataTypes.STRING,
    tenantId: dataTypes.UUID,
    createdBy: dataTypes.STRING,
    updatedBy: dataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Role',
    paranoid: true
  });

  return Role;
};


export default RoleFactory;