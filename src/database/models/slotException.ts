import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface SlotExceptionAttributes {
  id?: string,
  slotId: string,
  slotDateTime: Date,
  exceptionDescription?: string,
  slotDuration: number,
  assignedTo?: string,
  exceptionType: "EDIT" | "DELETE",
  newAssignee?: string,
  newDateTime?: Date,
  newDescription?: string,
  createdBy?: string,
  updatedBy?: string
};

export class SlotException extends Model<SlotExceptionAttributes> {
  static associate(models: any) {
    SlotException.belongsTo(models.Slot, { foreignKey: 'slotId' });
    SlotException.belongsTo(models.User, { foreignKey: 'assignedTo' });
    SlotException.belongsTo(models.User, { foreignKey: 'newAssignee' });
    SlotException.belongsTo(models.User, { foreignKey: 'createdBy' });
    SlotException.belongsTo(models.User, { foreignKey: 'updatedBy' });
  }
}

const SlotExceptionFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof SlotException => {

  SlotException.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    slotId: dataTypes.STRING,
    slotDateTime: dataTypes.DATE,
    exceptionDescription: dataTypes.STRING,
    slotDuration: dataTypes.NUMBER,
    assignedTo: dataTypes.STRING,
    exceptionType: dataTypes.ENUM("EDIT","DELETE"),
    newAssignee: dataTypes.STRING,
    newDateTime: dataTypes.DATE,
    newDescription: dataTypes.STRING,
    createdBy: dataTypes.STRING,
    updatedBy: dataTypes.STRING
  }, {
    sequelize,
    modelName: 'SlotException'
  });

  return SlotException;
};


export default SlotExceptionFactory;