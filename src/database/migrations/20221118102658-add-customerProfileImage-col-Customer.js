'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            'Customers',
            'customerProfileImage', {
                type: Sequelize.STRING,
                allowNull: true,
            });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Customers', 'customerProfileImage');
    }
};