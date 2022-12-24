'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      tenantId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Tenants',
            schema: 'public'
          },
          key: 'id'
        },
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Users',
            schema: 'public'
          },
          key: 'id'
        },
      },
      data: {
        allowNull: false,
        type: Sequelize.JSON
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isRead: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        default:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Notifications');
  }
};