'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Customers',
      'tenantId', {
        type: Sequelize.UUID, 
        allowNull: false,
        references: {
          model: 'Tenants',
          key: 'id'
        }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Customers', 'tenantId');
  }
};
