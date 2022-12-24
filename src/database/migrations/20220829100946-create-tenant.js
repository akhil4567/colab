'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tenants', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING
      },
      contactName: {
        type: Sequelize.STRING
      },
      contactNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      primaryContactId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Users',
            schema: 'public'
          },
          key: 'id'
        },
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM("pending", "active", "disabled"),
        defaultValue: "active"
      },
      parentTenantId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Tenants',
            schema: 'public'
          },
          key: 'id'
        },
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM("individual", "organisation", "subtenant"),
        defaultValue: "individual"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Users',
            schema: 'public'
          },
          key: 'id'
        },
      },
      updatedBy: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Users',
            schema: 'public'
          },
          key: 'id'
        },
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tenants');
  }
};