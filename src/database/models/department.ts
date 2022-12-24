import { Sequelize, Model, DataTypes, UUIDV4 } from "sequelize";

export interface departmentAttributes {
  id?: string;
  name: string;
  tenantId: string;
  status: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  deletedAt?: string;
}

export class Department extends Model<departmentAttributes> {
  static associate(models: any) {
    Department.belongsTo(models.Tenant, { foreignKey: "tenantId" });
    Department.belongsToMany(models.Location, {
      through: "LocationDepartmentMappings",
      foreignKey: "departmentId",
      as: "locations",
    });
    
    Department.hasMany(models.EngagementType , {foreignKey:'departmentId'})
    Department.belongsTo(models.User, { foreignKey: "createdBy" });
    Department.belongsTo(models.User, { foreignKey: "updatedBy" });
    Department.hasMany(models.LocationDepartmentMapping, {
      foreignKey: "departmentId",
      as: "departmentMapping",
    });
  }
}

const departmentFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof Department => {
  Department.init(
    {
      id: {
        type: dataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      tenantId: dataTypes.STRING,
      description: dataTypes.STRING,
      name: dataTypes.STRING,
      status: dataTypes.STRING,
      createdBy: dataTypes.UUID,
      updatedBy: dataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Department",
      paranoid: true,
    }
  );

  return Department;
};

export default departmentFactory;
