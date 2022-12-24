'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Plans', 
    { 
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM("pending", "active", "disabled"),
        defaultValue: "active"
      },
      type: {
        type: Sequelize.ENUM("standard", "custom"),
        defaultValue: "standard"
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
            model: 'Users',
            key: 'id'
        }
      },
      updatedBy: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
            model: 'Users',
            key: 'id'
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Plans');
    
  }
};
