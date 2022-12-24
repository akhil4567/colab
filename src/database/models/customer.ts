import { Serializable } from "child_process";
import { Sequelize, Model, DataTypes, UUIDV4 } from "sequelize";

export interface customerAttributes {
  id?: string;
  customerProfileImage?: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  customerType: string;
  gender: string;
  dateOfBirth: string;
  contactNumber: string;
  email: string;
  flag?: string;
  reason?: string;
  accountId: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  zipcode: string;
  additionalData?: object;
  createdBy?: string;
  updatedBy?: string;
  tenantId: string;
  deletedAt?: string;
}

export class Customer extends Model<customerAttributes> {
  static associate(models: any) {
    Customer.belongsTo(models.Tenant, { foreignKey: "tenantId" });
    Customer.belongsTo(models.User, { foreignKey: "createdBy" });
    Customer.belongsTo(models.User, { foreignKey: "updatedBy" });
    // Customer.belongsToMany(models.Project, { as: 'projects', through: 'UserProjectMapping', foreignKey: 'userId' });
  }
}

const customerFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): typeof Customer => {
  Customer.init(
    {
      id: {
        type: dataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      customerProfileImage: dataTypes.STRING,
      firstName: dataTypes.STRING,
      middleName: dataTypes.STRING,
      lastName: dataTypes.STRING,
      customerType: dataTypes.STRING,
      gender: dataTypes.STRING,
      dateOfBirth: dataTypes.STRING,
      contactNumber: dataTypes.STRING,
      email: dataTypes.STRING,
      flag: dataTypes.STRING,
      reason: dataTypes.STRING,
      accountId: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
      },
      addressLine1: dataTypes.STRING,
      addressLine2: dataTypes.STRING,
      city: dataTypes.STRING,
      country: dataTypes.STRING,
      zipcode: dataTypes.STRING,
      tenantId: dataTypes.STRING,
      additionalData: dataTypes.JSON,
      createdBy: dataTypes.UUID,
      updatedBy: dataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Customer",
      paranoid: true,
    }
  );

  return Customer;
};

export default customerFactory;
