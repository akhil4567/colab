import { Sequelize, Model, DataTypes, Optional, CreationOptional, UUIDV4, EnumDataType } from 'sequelize';

export interface LocationDepartmentMappingAttributes {
  id: string,
  locationId: string,
  departmentId: string,

};


export class LocationDepartmentMapping extends Model<LocationDepartmentMappingAttributes>{
 
 

  static associate(models: any) {
     // Location.belongsTo(models.Role, { foreignKey: 'departmentId' });
     
     // Location.belongsToMany(models.Department, {
     // through: 'LocationDepartmentMappings', foreignKey: 'locationId', as: 'departments'
     //});

    

  }
}

const locationDepartmentMappingFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof LocationDepartmentMapping => {

  LocationDepartmentMapping.init({
    id: {
      type: dataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    locationId: dataTypes.UUID,
    departmentId: dataTypes.UUID,
    
    
  }, {
    sequelize,
    modelName: 'LocationDepartmentMapping',
  });

  return LocationDepartmentMapping;
};


export default locationDepartmentMappingFactory;