'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ChatRoomMappings', {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            chatRoomId: {
                type: Sequelize.UUID,
                references: {
                    model: "ChatRooms",
                    key: "id",
                },
                allowNull: false,
            },
            userId: {
                type: Sequelize.UUID,
                references: {
                    model: "Users",
                    key: "id",
                },
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
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
        await queryInterface.dropTable('ChatRoomMappings');
    }
};