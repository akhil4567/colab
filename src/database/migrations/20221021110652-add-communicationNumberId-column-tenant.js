'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Tenants',
      'communicationNumberId', {
        type: Sequelize.UUID, 
        allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tenants', 'communicationNumberId');
  }
};
