'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.addIndex(
            'UserMappings', ['userId','tenantId'], {
                unique: true
            }
        );
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.removeIndex('UserMappings', ['userId','tenantId']);
    }
};