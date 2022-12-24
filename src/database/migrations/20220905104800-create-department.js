'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Departments', {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            name: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            tenantId: {
                type: Sequelize.UUID,
                references: {
                    model: {
                        tableName: 'Tenants',
                        schema: 'public'
                    },
                    key: 'id'
                },
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM("active", "inactive"),
                defaultValue: "active"
            },
            createdBy: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'Users',
                        schema: 'public'
                    },
                    key: 'id'
                },
            },
            updatedBy: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'Users',
                        schema: 'public'
                    },
                    key: 'id'
                },
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
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Departments');
    }
};