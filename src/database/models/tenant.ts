import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface TenantAttributes {
  id?: string,
  name: string,
  contactName?: string,
  email?: string,
  contactNumber?: string,
  status: string,
  parentTenantId?: string,
  type: string,
  planId?: string,
  addressLine1?: string,
  addressLine2?: string,
  street?: string,
  city?: string,
  state?: string,
  country?: string,
  zipCode?: string,
  messageNumberId?: string,
  voiceNumberId?: string,
  messageNumber?: string,
  voiceNumber?: string,
  createdBy?: string,
  updatedBy?: string,
  deletedAt?: string,
}

export class Tenant extends Model<TenantAttributes> {

  static associate(models: any) {
    Tenant.belongsTo(models.Tenant, { foreignKey: 'parentTenantId' });
    Tenant.belongsTo(models.User, { foreignKey: 'createdBy' });
    Tenant.belongsTo(models.User, { foreignKey: 'updatedBy' });
    Tenant.belongsTo(models.Plan, { foreignKey: 'planId' });
    Tenant.hasMany(models.Location, { foreignKey: 'tenantId'});
    Tenant.hasMany(models.Department, { foreignKey: 'tenantId'});
    Tenant.hasMany(models.UserMapping, { foreignKey: 'tenantId'});
    Tenant.hasOne(models.TenantConfiguration, { foreignKey: 'tenantId'});
  }
}

const tenantFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof Tenant => {
  Tenant.init(
    {
      id: {
        type: dataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      name: dataTypes.STRING,
      contactName: dataTypes.STRING,
      email: dataTypes.STRING,
      contactNumber: dataTypes.STRING,
      status: dataTypes.STRING,
      parentTenantId: dataTypes.UUID,
      type: dataTypes.STRING,
      planId: dataTypes.UUID,
      addressLine1: dataTypes.STRING,
      addressLine2: dataTypes.STRING,
      street: dataTypes.STRING,
      city: dataTypes.STRING,
      state: dataTypes.STRING,
      country: dataTypes.STRING,
      zipCode: dataTypes.STRING,
      messageNumberId: dataTypes.UUID,
      voiceNumberId: dataTypes.UUID,
      messageNumber: dataTypes.STRING,
      voiceNumber: dataTypes.STRING,
      createdBy: dataTypes.UUID,
      updatedBy: dataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'Tenant',
      paranoid: true
    }
  );

  return Tenant;
};

export default tenantFactory;
