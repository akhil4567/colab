'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ChatRooms', {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            name: {
                allowNull: true,
                type: Sequelize.STRING
            },
            isChannel: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            createdBy: {
                allowNull: true,
                type: Sequelize.UUID,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            updatedBy: {
                allowNull: true,
                type: Sequelize.UUID,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ChatRooms');
    }
};