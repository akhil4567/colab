'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StaffEngagements', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      engagementTypeId: {
        type: Sequelize.UUID,
        references: {
          model: 'EngagementTypes',
          key: 'id'
        },
        allowNull: true
      },
      title: {
        type: Sequelize.STRING(50)
      },
      description: {
        type: Sequelize.STRING
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      meetingMode: {
        type: Sequelize.ENUM('AUDIO','VIDEO','IN-PERSON'),
        allowNull: false
      },
      videoMeetingProvider: {
        type: Sequelize.STRING(40)
      },
      meetingLocation: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isRecurring: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      recurringDaysCron: {
        type: Sequelize.STRING(50)
      },
      cronTimeZone: {
        type: Sequelize.STRING(50)
      },
      endDate: {
        type: Sequelize.DATE
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      isCancelled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      updatedBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('StaffEngagements');
  }
};