import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface RolePermissionMappingAttributes {
  id?: string,
  roleId: string,
  permissionId: string,
};

export class RolePermissionMapping extends Model<RolePermissionMappingAttributes> {
  static associate(models: any) {
  }
}

const rolePermissionMappingFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof RolePermissionMapping => {

  RolePermissionMapping.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    roleId: dataTypes.STRING,
    permissionId: dataTypes.STRING,  
  }, {
    sequelize,
    modelName: 'RolePermissionMapping',
  });

  return RolePermissionMapping;
};


export default rolePermissionMappingFactory;