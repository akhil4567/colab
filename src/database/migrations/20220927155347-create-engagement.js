'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Engagements', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      description: {
        type: Sequelize.STRING,
      },
      engagementDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      engagementDateTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      slotId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Slots',
          key: 'id'
        }
      },
      customerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Customers',
          key: 'id'
        }
      },
      assignedTo: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
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
      createdAt: {
        type: Sequelize.DATE,
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
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      updatedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Engagements');
  }
};