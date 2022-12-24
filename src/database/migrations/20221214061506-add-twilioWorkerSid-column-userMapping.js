'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('UserMappings', 'twilioWorkerSid', {
        type: Sequelize.STRING, 
        allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('UserMappings', 'twilioWorkerSid');
  }
};
