'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.addIndex(
            'Customers', ['firstName', 'lastName', 'contactNumber', 'tenantId'], {
                unique: true
            }
        );
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.removeIndex('Customers', ['firstName', 'lastName', 'contactNumber', 'tenantId']);
    }
};