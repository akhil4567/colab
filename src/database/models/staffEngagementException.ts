import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface StaffEngagementExceptionAttributes {
  id?: string,
  staffEngagementId: string,
  oldDateTime: Date,
  exceptionDescription?: string,
  duration: string,
  exceptionType: 'EDIT' | 'CANCELLED',
  meetingMode?: 'AUDIO' | 'VIDEO' | 'IN-PERSON',
  videoMeetingProvider?: string,
  meetingLocation?: string,
  newDateTime?: Date,
  newDescription?: string,
  createdBy?: string,
  updatedBy?: string
};

export class StaffEngagementException extends Model<StaffEngagementExceptionAttributes> {
  static associate(models: any) {
    StaffEngagementException.belongsTo(models.StaffEngagement, { foreignKey: 'staffEngagementId' });
    StaffEngagementException.belongsTo(models.User, { foreignKey: 'createdBy' });
    StaffEngagementException.belongsTo(models.User, { foreignKey: 'updatedBy' });
  }
}

const StaffEngagementExceptionFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof StaffEngagementException => {

  StaffEngagementException.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    staffEngagementId: dataTypes.STRING,
    oldDateTime: dataTypes.DATE,
    exceptionDescription: dataTypes.STRING,
    duration: dataTypes.INTEGER,
    exceptionType: dataTypes.ENUM('EDIT','CANCELLED'),
    meetingMode: dataTypes.ENUM('AUDIO','VIDEO','IN-PERSON'),
    videoMeetingProvider: dataTypes.STRING,
    meetingLocation: dataTypes.STRING,
    newDateTime: dataTypes.DATE,
    newDescription: dataTypes.STRING,
    createdBy: dataTypes.STRING,
    updatedBy: dataTypes.STRING
  }, {
    sequelize,
    modelName: 'StaffEngagementException'
  });

  return StaffEngagementException;
};


export default StaffEngagementExceptionFactory;