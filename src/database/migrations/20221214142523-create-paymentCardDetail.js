'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PaymentCardDetails', 
    { 
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      subscriptionId: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Subscriptions',
            schema: 'public'
          },
          key: 'id'
        },
        allowNull: true,
      },
      cardNumber: {
        type: Sequelize.STRING,
      },
      cardShortDescription: {
        type: Sequelize.STRING,
      },
      cardExpiryDate: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('PaymentCardDetails');
    
  }
};
