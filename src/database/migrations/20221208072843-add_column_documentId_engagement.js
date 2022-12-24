'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Engagements',
      'documentId', {
        type: Sequelize.UUID, 
        allowNull: true,
        references: {
          model: 'Documents',
          key: 'id'
        }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Engagements', 'documentId');
  }
};
