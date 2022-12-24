'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Slots', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      tenantId: {
        type: Sequelize.UUID,
        references: {
          model: 'Tenants',
          key: 'id'
        },
        allowNull: true
      },
      departmentId: {
        type: Sequelize.UUID,
        references: {
          model: 'Departments',
          key: 'id'
        },
        allowNull: true
      },
      locationId: {
        type: Sequelize.UUID,
        references: {
          model: 'Locations',
          key: 'id'
        },
        allowNull: true
      },
      engagementTypeId: {
        type: Sequelize.UUID,
        references: {
          model: 'EngagementTypes',
          key: 'id'
        },
        allowNull: true
      },
      weekDaysCron: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      slotDuration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      assignedTo: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      slotTimeZone: {
        type: Sequelize.STRING(50),
        allowNull:false
      },
      slotDescription: {
        type: Sequelize.STRING
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Slots');
  }
};