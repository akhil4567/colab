import { Sequelize, Model, DataTypes, UUIDV4 } from 'sequelize';

export interface StaffEngagementAttributes {
  id?: string,
  engagementTypeId?: string,
  tenantId: string,
  title: string,
  description: string,
  startDate: Date,
  startTime: string,
  duration: number,
  meetingMode: 'AUDIO' | 'VIDEO' | 'IN-PERSON',
  videoMeetingProvider?: string,
  meetingLocation: string,
  isRecurring: boolean,
  recurringDaysCron?: string,
  cronTimeZone?: string,
  endDate?: Date,
  isActive?: boolean,
  isCancelled?: boolean,
  createdBy?: string,
  updatedBy?: string
};

export class StaffEngagement extends Model<StaffEngagementAttributes> {
	static associate(models: any) {
		StaffEngagement.hasMany(models.StaffEngagementException, { foreignKey: 'staffEngagementId', as: 'staffExceptions' });
		StaffEngagement.belongsTo(models.EngagementType, { foreignKey: 'engagementTypeId', as: 'engagementType' });

		StaffEngagement.belongsToMany(models.User, {
			through: 'StaffEngagementUserMappings', foreignKey: 'staffEngagementId', as: 'attendees'
		});
		StaffEngagement.hasMany(models.StaffEngagementUserMapping, {
			foreignKey: 'staffEngagementId', as: 'staffEngagementMappings'
		});

		StaffEngagement.belongsTo(models.User, { foreignKey: 'createdBy' });
		StaffEngagement.belongsTo(models.User, { foreignKey: 'updatedBy' });
	}
}

const StaffEngagementFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof StaffEngagement => {

  StaffEngagement.init({
    id: {
      type: dataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    engagementTypeId: dataTypes.STRING,
      tenantId: dataTypes.STRING,
      title: dataTypes.STRING(50),
      description: dataTypes.STRING,
      startDate: dataTypes.DATE,
      startTime: dataTypes.TIME,
      duration: dataTypes.INTEGER,
      meetingMode: dataTypes.ENUM('AUDIO','VIDEO','IN-PERSON'),
      videoMeetingProvider: dataTypes.STRING(40),
      meetingLocation: dataTypes.STRING,
      isRecurring: dataTypes.BOOLEAN,
      recurringDaysCron: dataTypes.STRING(50),
      cronTimeZone: dataTypes.STRING(50),
      endDate: dataTypes.DATE,
      isActive: {
        type: dataTypes.BOOLEAN,
        defaultValue: true,
      },
      isCancelled: {
        type: dataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdBy: dataTypes.STRING,
      updatedBy: dataTypes.STRING
  }, {
    sequelize,
    modelName: 'StaffEngagement',
    paranoid: true
  });

  return StaffEngagement;
};


export default StaffEngagementFactory;