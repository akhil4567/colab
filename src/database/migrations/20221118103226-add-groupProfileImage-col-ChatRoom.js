'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            'ChatRooms',
            'groupProfileImage', {
                type: Sequelize.STRING,
                allowNull: true,
            });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.removeColumn('ChatRooms', 'groupProfileImage');
    }
};