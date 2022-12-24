'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Permissions', 
    { 
      id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false
        },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      featureId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Features',
            schema: 'public'
          },
          key: 'id'
        },
        allowNull: true
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
    await queryInterface.dropTable('Permissions');
    
  }
};
