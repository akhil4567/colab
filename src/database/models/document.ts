import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface DocumentAttributes {
  id?: string,
  name?: string,
  documentType: string,
  fileKey: string,
  fileName: string,
  mimeType: string,
  customerId?: string,
  deletedAt?: string,
};

export class Document extends Model<DocumentAttributes> {
  static associate(models: any) {
    Document.belongsTo(models.Customer, { foreignKey: 'customerId' });
  }
}

const documentFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Document => {

  Document.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    name: dataTypes.STRING,
    documentType: dataTypes.STRING,
    fileName: dataTypes.STRING,
    fileKey: dataTypes.STRING,
    mimeType: dataTypes.STRING,
    customerId: dataTypes.UUID,
  }, {
    sequelize,
    modelName: 'Document',
    paranoid: true
  });

  return Document;
};


export default documentFactory;