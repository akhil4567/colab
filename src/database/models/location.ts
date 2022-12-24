import { Sequelize, Model, DataTypes, Optional, CreationOptional, UUIDV4, EnumDataType } from 'sequelize';

export interface LocationAttributes {
  id?: string,
  tenantId: string,
  name: string,
  status: string,
  locationLogitude?: string,
  locationLatitude?: string,
  address?: string,
  unit: string,
  street: string,
  state: string,
  city: string,
  zipcode: string,
  createdBy: string,
  updatedBy: string,
  deletedAt?: string,

};

export class Location extends Model<LocationAttributes> {
 

  static associate(models: any) {
    Location.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
    // Location.belongsTo(models.Role, { foreignKey: 'departmentId' });
     Location.belongsToMany(models.Department, {
      through: 'LocationDepartmentMappings', foreignKey: 'locationId', as: 'departments'
    });

    Location.hasMany(models.LocationDepartmentMapping, {
       foreignKey: 'locationId', as: 'locationMapping'
    });
    Location.belongsTo(models.User, { foreignKey: "createdBy" });
    Location.belongsTo(models.User, { foreignKey: "updatedBy" });
    // Location.belongsToMany(models.Project, { as: 'projects', through: 'UserProjectMapping', foreignKey: 'userId' });
  }
}

const locationFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Location => {

  Location.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tenantId: dataTypes.STRING,
    name: dataTypes.STRING,
    status: dataTypes.STRING,
    locationLogitude: dataTypes.STRING,
    locationLatitude: dataTypes.STRING,
    address: dataTypes.STRING,
    unit: dataTypes.STRING,
    street: dataTypes.STRING,
    state: dataTypes.STRING,
    city: dataTypes.STRING,
    zipcode: dataTypes.STRING,
    createdBy:	dataTypes.UUID,
    updatedBy:	dataTypes.UUID,
  }, {
    sequelize,
    modelName: 'Location',
    paranoid:true
  });

  return Location;
};


export default locationFactory;