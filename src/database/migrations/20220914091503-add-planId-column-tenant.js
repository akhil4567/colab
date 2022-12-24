'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Tenants',
      'planId', {
        type: Sequelize.UUID, 
        allowNull: true,
        references: {
          model: 'Plans',
          key: 'id'
        }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tenants', 'planId');
  }
};
