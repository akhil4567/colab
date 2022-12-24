'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Engagements', {
      fields: ['engagementDateTime', 'slotId'],
      type: 'unique',
      name: 'unique_constraint_slot_engagement'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Engagements', 'unique_constraint_slot_engagement');
  }
};
