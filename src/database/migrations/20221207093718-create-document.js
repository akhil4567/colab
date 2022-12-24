'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Documents', 
    { 
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      documentType: {
        type: Sequelize.STRING,
      },
      fileKey: {
        type: Sequelize.STRING,
      },
      fileName: {
        type: Sequelize.STRING,
      },
      mimeType: {
        type: Sequelize.STRING,
      },
      customerId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Customers',
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Documents');
    
  }
};
