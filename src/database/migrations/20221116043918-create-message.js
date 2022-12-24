'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Messages', {
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
            sentBy: {
                type: Sequelize.UUID,
                references: {
                    model: "Users",
                    key: "id",
                },
                allowNull: false,
            },
            message: {
                allowNull: false,
                type: Sequelize.STRING
            },

            isDeleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            documentLink: {
                allowNull: true,
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
        await queryInterface.dropTable('Messages');
    }
};