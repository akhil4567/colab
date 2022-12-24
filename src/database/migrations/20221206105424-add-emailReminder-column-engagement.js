'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Engagements', 'emailReminderTime', {
        type: Sequelize.DATE, 
        allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Engagements', 'emailReminderTime');
  }
};
